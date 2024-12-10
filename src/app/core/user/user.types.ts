export interface User {
    id: string;
    name: string;
    email: string;
    Icon?: string;
    status?: string;
    
    
    roles?: string[],
    claims?: string[]
}
