export interface PageProps {
    auth: {
        user: AuthUser | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export interface AuthUser {
    username: string;
    token: string;
}

export type PetStatus = 'available' | 'pending' | 'sold';

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface Pet {
    id: number;
    name: string;
    status: PetStatus;
    photoUrls: string[];
    category?: Category;
    tags?: Tag[];
}

export interface PetFormData {
    name: string;
    status: PetStatus;
    photoUrls: string[];
    category?: Category;
    tags?: Tag[];
}

export type OrderStatus = 'placed' | 'approved' | 'delivered';

export interface Order {
    id: number;
    petId: number;
    quantity: number;
    shipDate: string;
    status: OrderStatus;
    complete: boolean;
}

export interface Inventory {
    available: number;
    pending: number;
    sold: number;
    [key: string]: number;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userStatus: number;
}

export interface UserFormData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface ApiResponse<T = unknown> {
    code?: number;
    type?: string;
    message?: string;
    data?: T;
}

// ─── UI ───────────────────────────────────────────────────────────────────────
export type BadgeVariant = 'available' | 'pending' | 'sold' | 'placed' | 'approved' | 'delivered' | 'default';
