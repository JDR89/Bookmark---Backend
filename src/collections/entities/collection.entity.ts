import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('collections')
export class Collection {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', {
        default: 'folder'
    })
    icon: string;

    // RELACIÓN CON WORKSPACE (Padre)
    @ManyToOne(
        () => Workspace,
        (workspace) => workspace.collections,
        { onDelete: 'CASCADE' }
    )
    workspace: Workspace;

    @OneToMany(
        () => Bookmark,
        (bookmark) => bookmark.collection,
        { cascade: true, eager: true }
    )
    bookmarks: Bookmark[];
}