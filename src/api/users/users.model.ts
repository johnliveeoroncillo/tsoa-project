import { BaseModel } from "../../types/model.types";

/**
 * User objects allow you to associate actions performed in the system with the user that performed them.
 * The User object contains common information across every user in the system regardless of status and role.
 *
 *
 * @example {
 *  "id": "52907745-7672-470e-a803-a2f8feb52944",
 *  "name": "John Doe",
 *  "email": "john.doe@example.com",
 *  "password": "123456",
 *  "createdAt": "2025-09-26T15:42:13.208Z",
 * }
 */
export interface User extends BaseModel {
    /**
     * @isString User name must be a string
     */
    name: string;
    
    /**
     * @isEmail Must be a valid email address
     * @pattern ^(.+)@(.+)$ please provide correct email
     */
    email: string;
    
    /**
     * @isString Password must be a string
     * @required Password is required
     * @minLength 8 Password must be at least 8 characters long
     * @maxLength 128 Password cannot exceed 128 characters
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&] Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character
     */
    password: string;
}