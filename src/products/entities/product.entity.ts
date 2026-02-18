import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: "products",
    comment: "Tabla de productos"
})
export class Product {

    @ApiProperty({
        example: "1a80f6bc-dcd4-4f56-9356-c537de1dd381",
        description: "Product ID",
        uniqueItems: true
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({
        example: "T-Shirt",
        description: "Product Title",
        uniqueItems: true
    })
    @Column("text", { unique: true })
    title: string;

    @ApiProperty({
        example: 10,
        description: "Product Price",
    })
    @Column("float", {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: "lorem ipsum dolor sit amet consectetur adipiscing elit...",
        description: "Product Description",
        default: null
    })
    @Column({
        type: "text",
        nullable: true
    })
    description: string

    @ApiProperty({
        example: "t_shirt",
        description: "Product Slug",
        uniqueItems: true
    })
    @Column("text", {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: "Product Stock",
    })
    @Column("int", {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ["S", "M", "L", "XL"],
        description: "Product Sizes",
    })
    @Column("text", {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: "men",
        description: "Product Gender",
    })
    @Column("text")
    gender: string

    @ApiProperty({
        example: ["t-shirt", "men", "summer"],
        description: "Product Tags",
    })
    @Column("text", {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true, eager: true })
    images?: ProductImage[]


    @ManyToOne(() => User, (user) => user.product, { eager: true })
    user: User

    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "");
    }



}
