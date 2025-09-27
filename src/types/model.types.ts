export interface BaseModel {
    /**
     * @isString ID must be a valid string
     */
    id: string;
    /**
     * @isDate Creation date must be a valid date
     */
    createdAt: Date;
}
