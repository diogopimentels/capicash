export interface ClerkWebhookEvent {
    type: 'user.created' | 'user.updated' | 'user.deleted';
    data: {
        id: string;
        email_addresses: Array<{
            id: string;
            email_address: string;
            verification: { status: string };
        }>;
        first_name?: string;
        last_name?: string;
        image_url?: string;
        username?: string;
        created_at: number;
        updated_at: number;
    };
}
