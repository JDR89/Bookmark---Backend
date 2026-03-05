

export const initialData = {

    users: [
        {
            email: 'admin@teslo.com',
            fullName: 'Admin User',
            password: 'Abc123',
            workspace: [
                {
                    name: 'Admin Workspace',
                    icon: 'folder',
                    color: 'blue',
                    collections: [
                        {
                            name: 'General Links',
                            icon: 'folder',
                            bookmarks: [
                                { title: 'Google', url: 'https://google.com', description: 'Search engine', isFavorite: true },
                                { title: 'NestJS', url: 'https://nestjs.com', description: 'Framework docs', isFavorite: false }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            email: 'user@teslo.com',
            fullName: 'Normal User',
            password: 'Abc123',
            workspace: [
                {
                    name: 'Personal',
                    icon: 'user',
                    color: 'green',
                    collections: [
                        {
                            name: 'Resources',
                            icon: 'bookmark',
                            bookmarks: [
                                { title: 'Google', url: 'https://google.com', description: 'Search engine', isFavorite: false }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
