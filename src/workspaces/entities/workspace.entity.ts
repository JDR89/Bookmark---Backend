import { User } from 'src/auth/entities/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';

@Entity('workspaces')
export class Workspace {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('text', {
        default: 'folder'
    })
    icon: string;

    @Column('text', {
        default: 'blue'
    })
    color: string;

    @Column('int', {
        default: 0
    })
    orderIndex: number;

    @ManyToOne(
        () => User,
        (user) => user.workspace,
        { eager: true }
    )
    user: User;

    @OneToMany(
        () => Collection,
        (collection) => collection.workspace,
        { cascade: true, eager: true }
    )
    collections: Collection[];

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.name;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.name
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}