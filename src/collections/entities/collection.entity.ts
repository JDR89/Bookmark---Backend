import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}