const mockDomains = [
	{
		domain: 'domain1.rsk',
		expiration: '3030/03/02',
		autoRenew: true,
		status: 'active',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x5F4df703Da966E12d3068E1aCbe930f2E363c732',
		isLuminoNode: true,
		isRifStorage: true,
		resolvers: [
			{
				name: "MultiCrypto",
				network: [
					{
						networkName: 'Bitcoin',
						networkIcon: 'bitcoin',
						address: '0x00000000000000',
					},
					{
						networkName: 'RSK',
						networkIcon: 'rsk',
						address: '0x00000000000000',
					},
				],
			},
			{
				name: "AnotherResolver",
				network: [
					{
						networkName: 'Ethereum',
						networkIcon: 'ethereum',
						address: '0x00000000000000',
					},
				],
			},
		],
	},
	{
		domain: 'blockchain.rsk',
		expiration: '2020/06/10',
		autoRenew: true,
		status: 'pending',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'charrua.rsk',
		expiration: '2019/12/31',
		autoRenew: false,
		status: 'expired',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'lakers.rsk',
		expiration: '2020/05/01',
		autoRenew: false,
		status: 'expiring',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'jhon.rsk',
		expiration: '2021/03/02',
		autoRenew: false,
		status: 'active',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x7b2BcC246d0120C35B2CC7f52ece3E58df592C77',
		isLuminoNode: true,
		isRifStorage: true,
		resolvers: [
			{
				name: "MultiCrypto",
				network: [
					{
						networkName: 'Bitcoin',
						networkIcon: 'bitcoin',
						address: '0x00000000000000',
					},
					{
						networkName: 'RSK',
						networkIcon: 'rsk',
						address: '0x00000000000000',
					},
				],
			},
			{
				name: "AnotherResolver",
				network: [
					{
						networkName: 'Ethereum',
						networkIcon: 'ethereum',
						address: '0x00000000000000',
					},
				],
			},
		],
	},
	{
		domain: 'doe.rsk',
		expiration: '2021/03/02',
		autoRenew: false,
		status: 'active',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x7b2BcC246d0120C35B2CC7f52ece3E58df592C77',
		isLuminoNode: true,
		isRifStorage: true,
		resolvers: [
			{
				name: "MultiCrypto",
				network: [
					{
						networkName: 'Bitcoin',
						networkIcon: 'bitcoin',
						address: '0x00000000000000',
					},
					{
						networkName: 'RSK',
						networkIcon: 'rsk',
						address: '0x00000000000000',
					},
				],
			},
			{
				name: "AnotherResolver",
				network: [
					{
						networkName: 'Ethereum',
						networkIcon: 'ethereum',
						address: '0x00000000000000',
					},
				],
			},
		],
	},
]