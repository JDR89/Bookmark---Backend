import { Collection } from '../../collections/entities/collection.entity'; // Asegúrate de la ruta
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Definimos el Enum aquí o en otro archivo si lo usas mucho
export enum BookmarkStatus {
    ACTIVE = 'active',
    ARCHIVED = 'archived',
    DELETED = 'deleted' // Opcional, si haces soft-delete
}

@Entity('bookmarks')
export class Bookmark {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text')
    url: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column('text', { nullable: true }) // Antes image, ahora favicon
    favicon?: string;

    @CreateDateColumn() // <--- Mágicamente pone la fecha de creación
    createdAt: Date;

    @Column('bool', { default: false })
    isFavorite: boolean;

    @Column('bool', { nullable: true, default: false })
    hasDarkIcon?: boolean;

    @Column('text', { default: BookmarkStatus.ACTIVE })
    status: string; // O puedes usar type: 'enum' si usas Postgres nativo

    @Column('int', { default: 0 })
    orderIndex: number;

    // RELACIÓN CON COLLECTION (Padre)
    @ManyToOne(
        () => Collection,
        (collection) => collection.bookmarks,
        { onDelete: 'CASCADE' }
    )
    collection: Collection;
}