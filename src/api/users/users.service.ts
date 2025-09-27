import { User } from './users.model';

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "password">;

export class UsersService {
  public get(id: string, name?: string): User {
    return {
      id,
      email: "jane@doe.com",
      name: name ?? "Jane Doe",
      password: "123456",
      createdAt: new Date(),
    };
  }

  public getAll(): User[] {
    return [
      {
        id: "1",
        email: "jane@doe.com",
        name: "Jane Doe",
        password: "123456",
        createdAt: new Date(),
      },
      {
        id: "2",
        email: "john@doe.com",
        name: "John Doe",
        password: "123456",
        createdAt: new Date(),
      },
      {
        id: "3",
        email: "jim@doe.com",
        name: "Jim Doe",
        password: "123456",
        createdAt: new Date(),
      },
      {
        id: "4",
        email: "jill@doe.com",
        name: "Jill Doe",
        password: "123456",
        createdAt: new Date(),
      },
    ];
  }

  public create(userCreationParams: UserCreationParams): User {
    return {
      id: Math.floor(Math.random() * 10000).toString(), // Random
      createdAt: new Date(),
      ...userCreationParams,
    };
  }
}