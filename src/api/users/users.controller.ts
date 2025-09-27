// src/users/usersController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Response,
    Example,
    // Middlewares,
    Request,
    Security,
    // TsoaResponse,
    // Res,
  } from "tsoa";
  import { Request as ExpressRequest } from "express";
  import { User } from "./users.model";
  import { UsersService, UserCreationParams } from "./users.service";
  import { NotFoundException, BadRequestException } from "../../common/exceptions/http.exceptions";
  import { JwtService } from "../../services/jwt.service";

  
  interface ValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
  }

  @Route("users")
  export class UsersController extends Controller {
    private usersService: UsersService;
    constructor() {
        super();
        this.usersService = new UsersService();
    }

    @Get("me")
    @Security("bearer", ["admin"])
    public async getMe(
      @Request() req: ExpressRequest
    ): Promise<User> {
      console.log("User from middleware:", req.user);
      
      if (!req.user) {
        throw new NotFoundException('User not authenticated');
      }
      
      return this.usersService.get(req.user.id);
    }

    @Post("login")
    public async login(@Body() requestBody: { email: string; password: string }): Promise<{ token: string }> {
      // Simple mock login - in real app, validate credentials
      if (requestBody.email === "test@example.com" && requestBody.password === "password") {
        const token = JwtService.generateToken({
          userId: "1",
          email: requestBody.email,
        });
        
        return { token };
      }
      
      throw new BadRequestException("Invalid credentials");
    }

    /**
     * Get a user by id
     * @summary Get a user by id
     * @param userId 
     * @param name 
     * @example userId "52907745-7672-470e-a803-a2f8feb52944"
     * @returns User
     */
    @Example<ApiResponse<User>>({
        status: 200,
        message: "User retrieved successfully",
        data: {
        id: "52907745-7672-470e-a803-a2f8feb52944",
        name: "tsoa user",
        email: "hello@tsoa.com",
        password: "123456",
        createdAt: new Date(),
        }
      })
    @Response(404, "User not found")
    @Get("{userId}")
    public async getUser(
      @Path() userId: string,
      @Query() name?: string
    ): Promise<User> {
      if (userId !== "1") {
        throw new NotFoundException("User not found");
      }
      return this.usersService.get(userId, name);
    }

    @Get()
    public async getUsers(): Promise<User[]> {
      return this.usersService.getAll();
    }
  
    /**
     * Create a user
     * @param requestBody 
     * @returns User
     */
    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams,
    //   @Res() notFoundResponse: TsoaResponse<404, { reason: string }>
    ): Promise<User> {
      // Example: Validate email format
      if (requestBody.email && !requestBody.email.includes('@')) {
        throw new BadRequestException("Invalid email format");
      }
      
      this.setStatus(201); // set return status 201 
      const user = this.usersService.create(requestBody);
      return user;
    }

  }