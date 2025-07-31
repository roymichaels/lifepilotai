import { IpfsService } from '@/services/IpfsService'
import { sendMessage, wakuTopics } from '@/lib/wakuTopics'

export interface Product {
  id: string
  name: string
  price: number
  createdAt: string
  ipfsHash?: string
}

/**
 * Simple client-side e-commerce shop template.
 * Products are stored on IPFS and announced over Waku.
 */
export class EcommerceShop {
  products: Product[] = []

  async addProduct(name: string, price: number): Promise<Product> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const product: Product = { id, name, price, createdAt }
    try {
      const hash = await IpfsService.uploadJson(product)
      product.ipfsHash = hash
      await sendMessage(wakuTopics.ecommerceData, { id, hash, createdAt })
    } catch (err) {
      console.error('[EcommerceShop] failed to store product', err)
    }
    this.products.push(product)
    return product
  }
}
