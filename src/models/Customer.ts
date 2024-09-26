export default interface CustomerModel {
    id: string;          // Unique identifier for the customer
    name: string;        // Name of the customer
    email: string;       // Email address of the customer
    phoneNumber: string; // Phone number of the customer
    createdAt: Date;     // Date when the customer was created
    updatedAt: Date;     // Date when the customer was last updated
}
