var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Web3 = require('../packages/web3');
var Accounts = require("./../packages/web3-eth-accounts");
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var ethTx = require('@ethereumjs/tx');

var common = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    harfork: 'petersburg',
};

var commonBerlin = {
    baseChain: 'mainnet',
    customChain: {
        name: 'custom-network',
        networkId: 1,
        chainId: 1,
    },
    hardfork: 'berlin'
};

var accessList = [
    {
      address: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
      storageKeys: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55'
    }
];

var clone = function (object) { return object ? _.clone(object) : []; };

var tests = [
    // {
    //     address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    //     iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
    //     privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "20000000000",
    //         gas: 21000,
    //         to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    //         toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
    //         value: "1000000000",
    //         data: "",
    //         common: common
    //     },
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
    //     oldSignature: "0xf868808504a817c80082520894f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008026a0afa02d193471bb974081585daabf8a751d4decbb519604ac7df612cc11e9226da04bf1bd55e82cebb2b09ed39bbffe35107ea611fa212c2d9a1f1ada4952077118",
    //     transactionHash: "0xab0f71614c37231d71ae521ce188a9c7c9d5e976124a91f62f9f125348dd0326",
    //     messageHash: "0xab0f71614c37231d71ae521ce188a9c7c9d5e976124a91f62f9f125348dd0326"
    // },
    {
            address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
            iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
            privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
            transaction: {
                chainId: 1,
                nonce: 0,
                gasPrice: 0x0,
                gas: 31853,
                to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
                toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
                value: "0",
                data: "",
                common: common
            },
            // expected r and s values from signature
            r: "0x22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd9",
            s: "0x83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
            // signature from eth_signTransaction
            rawTransaction: "0xf85d8080827c6d94f0109fc8df283027b6285cc889f5aa624eac1f558080269f22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd99f83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
            oldSignature: "0xf85d8080827c6d94f0109fc8df283027b6285cc889f5aa624eac1f558080269f22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd99f83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
            transactionHash: "0xb0c5e2c6b29eeb0b9c1d63eaa8b0f93c02ead18ae01cb7fc795b0612d3e9d55a",
            messageHash: "0xb0c5e2c6b29eeb0b9c1d63eaa8b0f93c02ead18ae01cb7fc795b0612d3e9d55a"
    },
    // {
    //     address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    //     iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
    //     privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "234567897654321",
    //         gas: 2000000,
    //         to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    //         toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
    //         value: "1000000000",
    //         data: "",
    //         common: common
    //     },
    //     // expected r and s values from signature
    //     r: "0x9ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9c",
    //     s: "0x440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
    //     oldSignature: "0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428",
    //     transactionHash: "0xd8f64a42b57be0d565f385378db2f6bf324ce14a594afc05de90436e9ce01f60",
    //     messageHash: "0xd8f64a42b57be0d565f385378db2f6bf324ce14a594afc05de90436e9ce01f60"
    // },
    // {
    //     address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    //     iban: 'XE0556YCRTEZ9JALZBSCXOK4UJ5F3HN03DV',
    //     privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "30000",
    //         gas: 31853,
    //         to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    //         toIban: 'XE04S1IRT2PR8A8422TPBL9SR6U0HODDCUT', // will be switched to "to" in the test
    //         value: "0",
    //         data: "",
    //         common: common
    //     },
    //     // expected r and s values from signature
    //     r: "0x22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd9",
    //     s: "0x83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf86180827530827c6d94f0109fc8df283027b6285cc889f5aa624eac1f55808025a0f5ff501fc7f72e5fefb52aebaf422b5f5148f6d3aa8d72e23d7387ec90cb0f59a05e7b564f1e56b3832adfa36e6a20af0ecb4f8c82d4472d6f43594f349951d9d5",
    //     oldSignature: "0xf85d8080827c6d94f0109fc8df283027b6285cc889f5aa624eac1f558080269f22f17b38af35286ffbb0c6376c86ec91c20ecbad93f84913a0cc15e7580cd99f83d6e12e82e3544cb4439964d5087da78f74cefeec9a450b16ae179fd8fe20",
    //     transactionHash: "0xb0c5e2c6b29eeb0b9c1d63eaa8b0f93c02ead18ae01cb7fc795b0612d3e9d55a",
    //     messageHash: "0xb0c5e2c6b29eeb0b9c1d63eaa8b0f93c02ead18ae01cb7fc795b0612d3e9d55a"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     iban: 'XE25RG8S3H5TX5RD7QTL5UPVW90AHN2VYDC',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "20000000000",
    //         gas: 21000,
    //         to: '0x3535353535353535353535353535353535353535',
    //         toIban: 'XE4967QZMA14MI680T89KSPPJEJMU68MEYD', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "",
    //         common: common
    //     },
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0",
    //     oldSignature: "0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a7640000801ba0300e0d8f83ac82943e468164fa80236fdfcff21f978f66dd038b875cea6faa51a05a8e4b38b819491a0bb4e1f5fb4fd203b6a1df19e2adbec2ebdddcbfaca555f0",
    //     transactionHash: "0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384",
    //     messageHash: "0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a031bb05bd1535150d312dcaa870a4a69c130a51aa80537659c1f308bf1f180ac6a012c938a8e04ac4e279d0b7c29811609031a96e949ad98f1ca74ca6078910bede",
    //     oldSignature: "0xf8708085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd1ba081bba037015419ab5ce36e930b987da71b0ed5f0efb1849613223bf72399f598a05d2c1f109ad13f98a7693cfc35291e404ea8795755a176eb58a818de44f3756d",
    //     transactionHash: "0xe86ab542020b3f386af1a1c79881d5db06f5fac58da79f697308f1d1e1799f2c",
    //     messageHash: "0xe86ab542020b3f386af1a1c79881d5db06f5fac58da79f697308f1d1e1799f2c"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 10,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
    //     oldSignature: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
    //     transactionHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7",
    //     messageHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: '0xa',
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
    //     oldSignature: "0xf8700a85358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a0496e628e8348a24312ded09ee3d99d85b1b8f947725aa382dcf4003b7389d5aaa00c1b1cfdd66c510fd708d33279a1a61e53dff3c6ced67cf7f7b830862d6e2029",
    //     transactionHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7",
    //     messageHash: "0x42fb18cc20b10438c6b4bcb4f3fc777a72195caf3e8b6ddc671df4a249e84ba7"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: '16',
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
    //     oldSignature: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
    //     transactionHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212",
    //     messageHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 16,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
    //     oldSignature: "0xf8701085358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd25a04ba217e16f62ac277698e8853bcc010db07285b457606e9f3487c70ccc5e6508a05c6cfaa17fc1a52bede0cf25c8bd2e024b4fb89ed205f62cb3e177a83654f29d",
    //     transactionHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212",
    //     messageHash: "0xa2db7be5398c250e3ecf569c573f222255d46c509199ff649cca5e806edf5212"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: '0x16',
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
    //     oldSignature: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
    //     transactionHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13",
    //     messageHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: '0x16',
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         input: "0x0123abcd",
    //         common: common
    //     },
    //     // web3.eth.signTransaction({from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0", gasPrice: "230000000000", gas: "50000", to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c', value: "1000000000000000000", data: "0x0123abcd"}).then(console.log);
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
    //     oldSignature: "0xf8701685358d117c0082c35094fcad0b19bb29d4674531d6f115237e16afce377c880de0b6b3a7640000840123abcd26a0e027ec9e9921975678b73de44f7d2cd6b987a6655b9d0291b2cdff15836c6efba051b4e20835793bf0cdf268339111a24d80a4a7bb141e975a66d0edbcc20542d0",
    //     transactionHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13",
    //     messageHash: "0x3135f97ac8d534b4b487cc2965fb1dcf427b92fd233577900dab3420e7afca13"
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 2,
    //         gasPrice: "20000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         input: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 2,
    //         gasPrice: "20000",
    //         gas: 0,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         input: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 2,
    //         gasPrice: "0A",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 2,
    //         gasPrice: "200000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "test",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 2,
    //         gasPrice: "A",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 'a',
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: -1,
    //         nonce: 1,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: -1,
    //         nonce: 0,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: -2,
    //         gasPrice: "230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "-230000000000",
    //         gas: 50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
    //     privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    //     transaction: {
    //         chainId: 1,
    //         nonce: 0,
    //         gasPrice: "230000000000",
    //         gas: -50000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000000000000",
    //         data: "0x0123abcd",
    //         common: common
    //     },
    //     error: true
    // },
    // {
    //     address: '0x2c7536E3605D9C16a7a3D7b1898e529396a65c23',
    //     privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    //     transaction: {
    //         chainId: 1,
    //         type: '0x01',
    //         nonce: 0,
    //         gasPrice: "20000000000",
    //         gas: 53000,
    //         to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
    //         toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
    //         value: "1000000000",
    //         data: "",
    //         common: commonBerlin,
    //         accessList: accessList
    //     },
    //     // signature from eth_signTransaction
    //     rawTransaction: "0xf868808504a817c80082cf0894fcad0b19bb29d4674531d6f115237e16afce377c843b9aca008026a0c6bcc76a3b4e1e887bc247082d1e1a4f9de8bc62d4aa01735d61047a116f168ba0145dd9e19fb77d639f6f5982674c215243066f927ad6ade47b071bc423bd8caf",
    //     oldSignature: "0xf854808504a817c80082cf0880843b9aca008026a061db896f806871e73071e328e9423460d231305472270e39043316f54963d4e1a040c799404b96d38858312f567ef40504c7ee0f646f7e050f9afe225095dbd4c2",
    //     transactionHash: "0x53123f415b39ef1b4981f9dbaf7743bc6f5a69d21fa3d767c9ac23c6e4cd6c81",
    //     messageHash: "0x53123f415b39ef1b4981f9dbaf7743bc6f5a69d21fa3d767c9ac23c6e4cd6c81"
    // },
];

describe("eth", function () {
    describe("accounts", function () {

        // For each test
        tests.forEach(function (test, i) {
            if (test.error) {

                // it("signTransaction must error", function(done) {
                //     var ethAccounts = new Accounts();

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     testAccount.signTransaction(test.transaction).catch(function (err) {
                //         assert.instanceOf(err, Error);
                //         done();
                //     });
                // });

            } else {

                // it("signTransaction must compare to eth_signTransaction", function(done) {
                //     var ethAccounts = new Accounts();

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     testAccount.signTransaction(test.transaction).then(function (tx) {
                //         assert.equal(tx.messageHash, test.messageHash);
                //         assert.equal(tx.transactionHash, test.transactionHash);
                //         assert.equal(tx.rawTransaction, test.rawTransaction);
                //         done();
                //     });
                // });

                // it("signTransaction using the iban as \"to\" must compare to eth_signTransaction", function(done) {
                //     var ethAccounts = new Accounts();

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     transaction.to = transaction.toIban;
                //     delete transaction.toIban;
                //     testAccount.signTransaction(transaction).then(function (tx) {
                //         assert.equal(tx.rawTransaction, test.rawTransaction);
                //         done();
                //     });
                // });

                // it("signTransaction will call for nonce", function(done) {
                //     var provider = new FakeHttpProvider();
                //     var web3 = new Web3(provider);

                //     provider.injectResult('0xa');
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_getTransactionCount');
                //         assert.deepEqual(payload.params, [test.address, "latest"]);
                //     });

                //     var ethAccounts = new Accounts(web3);

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     delete transaction.nonce;
                //     testAccount.signTransaction(transaction)
                //     .then(function (tx) {
                //         assert.isObject(tx);
                //         assert.isString(tx.rawTransaction);

                //         done();
                //     });
                // });

                // it("signTransaction will call for gasPrice", function(done) {
                //     var provider = new FakeHttpProvider();
                //     var web3 = new Web3(provider);

                //     provider.injectResult('0x5022');
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_gasPrice');
                //         assert.deepEqual(payload.params, []);
                //     });

                //     var ethAccounts = new Accounts(web3);

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     delete transaction.gasPrice;
                //     testAccount.signTransaction(transaction)
                //     .then(function (tx) {
                //         assert.isObject(tx);
                //         assert.isString(tx.rawTransaction);

                //         done();
                //     });
                // });

                // it("signTransaction will call for chainId", function(done) {
                //     var provider = new FakeHttpProvider();
                //     var web3 = new Web3(provider);

                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_chainId');
                //         assert.deepEqual(payload.params, []);
                //     });

                //     var ethAccounts = new Accounts(web3);

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     delete transaction.chainId;
                //     testAccount.signTransaction(transaction)
                //     .then(function (tx) {
                //         assert.isObject(tx);
                //         assert.isString(tx.rawTransaction);

                //         done();
                //     });
                // });

                // it("signTransaction will call for networkId", function(done) {
                //     var provider = new FakeHttpProvider();
                //     var web3 = new Web3(provider);

                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_networkId');
                //         assert.deepEqual(payload.params, []);
                //     });

                //     var ethAccounts = new Accounts(web3);

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     delete transaction.common;
                //     testAccount.signTransaction(transaction)
                //     .then(function (tx) {
                //         assert.isObject(tx);
                //         assert.isString(tx.rawTransaction);

                //         done();
                //     });
                // });

                // it("signTransaction will call for nonce, gasPrice, chainId and networkId", function(done) {
                //     var provider = new FakeHttpProvider();
                //     var web3 = new Web3(provider);

                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_chainId');
                //         assert.deepEqual(payload.params, []);
                //     });
                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_gasPrice');
                //         assert.deepEqual(payload.params, []);
                //     });
                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_getTransactionCount');
                //         assert.deepEqual(payload.params, [test.address, "latest"]);
                //     });
                //     provider.injectResult(1);
                //     provider.injectValidation(function (payload) {
                //         assert.equal(payload.jsonrpc, '2.0');
                //         assert.equal(payload.method, 'eth_networkId');
                //         assert.deepEqual(payload.params, []);
                //     });

                //     var ethAccounts = new Accounts(web3);

                //     var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                //     assert.equal(testAccount.address, test.address);

                //     var transaction = clone(test.transaction);
                //     delete transaction.chainId;
                //     delete transaction.gasPrice;
                //     delete transaction.nonce;
                //     delete transaction.common;
                //     testAccount.signTransaction(transaction)
                //     .then(function (tx) {
                //         assert.isObject(tx);
                //         assert.isString(tx.rawTransaction);

                //         done();
                //     });
                // });

                it("recoverTransaction, must recover signature", function() {
                    var ethAccounts = new Accounts();

                    var testAccount = ethAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(ethAccounts.recoverTransaction(tx.rawTransaction), test.address);
                    });
                });
            }
        });
    });
});