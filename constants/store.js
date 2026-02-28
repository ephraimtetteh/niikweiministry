import Category1 from '@/public/stores/accessory.png'
import Category from '@/public/stores/category.png'
import Category2 from '@/public/stores/digital.png'
import FountainOfGlory from '@/public/stores/fountain_of_glory.jpg'
import FountainOfGloryBlack from '@/public/stores/fountain_of_glory_black.jpg'
import FountainOfGloryWhite from '@/public/stores/fountain_of_glory_white.jpg'
import FountainOfGloryGray from '@/public/stores/fountain_of_glory_gray.jpg'
import Hoodie from '@/public/stores/hoodie.jpg'
import LetJudahLead from '@/public/stores/let_judah.jpg'
import hut from '@/public/stores/hut.jpeg'

export const store = [
    {
        images: FountainOfGlory,
        image: [FountainOfGlory, FountainOfGloryBlack, FountainOfGloryWhite, FountainOfGloryGray],
        name: "Fountain of Glory T-Shirt",
        category: "Clothing",
        price: 75.00,
        description: "Comfortable cotton t-shirt featuring our ministry logo. Perfect for casual wear and showing your support.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        images: hut,
        image: [FountainOfGlory, FountainOfGloryBlack, FountainOfGloryWhite, FountainOfGloryGray],
        name: "Ministry Hut",
        category: "Clothing",
        price: 100.00,
        description: "Comfortable cotton hut featuring our ministry logo. Perfect for casual wear and showing your support.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        images: LetJudahLead,
        image: [LetJudahLead, LetJudahLead, LetJudahLead, LetJudahLead],
        name: "The Judah Experience T-Shirt",
        category: "Clothing",
        price: 75.00,
        description: "Comfortable cotton t-shirt featuring our ministry logo. Perfect for casual wear and showing your support.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    // {
    //     image: Book,
    //     name: "Devotional Book",
    //     category: "Digital Product",
    //     price: 12.00,
    //     description: "Daily devotional guide to help you grow in your spiritual journey.",
    //     format: "PDF",
    //     inStock: true
    // },
    // {image: Bag, name: "Scripture Tote Bag", category: "Accessories", price: 18.00},
    // {image: CD, name: "Worship Album Download", category: "Digital Product", price: 7.00},
    {images: Hoodie, image: [Hoodie, Hoodie, Hoodie, Hoodie], name: "Faith Hoodie", category: "Clothing", price: 350.00},
    // {image: Mug, name: "Inspirational Mug", category: "Accessories", price: 15.00},
]

export const category = [
    {image: Category, category: "Clothing", description: "T-shirts, hoodies, and caps featuring ministry logos"},
    {image: Category1, category: "Accessories", description: "Keychains, mugs, tote bags, and wristbands"},
    {image: Category2, category: "Digital Products", description: "Downloadable worship music and sermon series"},
]