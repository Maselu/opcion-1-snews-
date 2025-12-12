export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Article {
    id: number;
    category_id: number;
    title: string;
    content: string;
    source?: string;
    published_at: string;
    category?: Category;
    comments_count?: number; //Opcional si añadimos recuento                                            
}

export interface Comment {
    id: number;
    user_id: string;
    article_id?: number;
    topic_id?: number;
    parent_comment_id?: number;
    content: string;
    created_at: string;
    edited_at?: string | null;
    user?: User;
    replies?: Comment[];
    likes?: Like[];
}

export interface Like {
    id: number;
    user_id: string;
    comment_id: number;
}

export interface Topic {
    id: number;
    user_id: string;
    title: string;
    description?: string;
    created_at: string;
    user?: User;
}

export interface WeatherData {
    location: string;
    temp_c: number;
    condition: string;
    humidity: number;
    wind_kph: number;
}
