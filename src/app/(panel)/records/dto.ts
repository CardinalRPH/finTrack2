interface Transaction {
    data: {
        id: string
        type: 'INCOME' | 'OUTCOME' | 'TRANSFER'
        amount: number | any // Decimal dari Prisma biasanya terbaca number/string di FE
        walletId: string
        toWalletId?: string | null
        categoryId?: string | null
        category?: {
            name: string
            icon: string
            color: string
        } | null
        wallet: {
            name: string;
            type: string; // Tambahkan type sesuai response
        }
        toWallet?: { name: string } | null
        date: Date | string // Prisma mengembalikan Date object
        createdAt: Date | string
        description: string | null
        isInvestment: boolean
        gramAmount?: number | any | null
        buyPrice?: number | any | null
        sellPrice?: number | any | null
    },
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        nextPage: number | null,
        prevPage: number | null
    }

}