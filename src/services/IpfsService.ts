export class IpfsService {
  private static readonly PINATA_URL =
    'https://api.pinata.cloud/pinning/pinJSONToIPFS'

  private static getJwt(): string | undefined {
    return (
      (typeof import.meta !== 'undefined' &&
        (import.meta as any).env?.VITE_PINATA_JWT) ||
      process.env.PINATA_JWT
    )
  }

  static async uploadJson(data: object): Promise<string> {
    const jwt = this.getJwt()
    if (!jwt) throw new Error('Missing Pinata JWT')

    const res = await fetch(this.PINATA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({ pinataContent: data })
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Pinata upload failed (${res.status}): ${text}`)
    }

    const json = await res.json()
    return json.IpfsHash || json.ipfsHash
  }
}
