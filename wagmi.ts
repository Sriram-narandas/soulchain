import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = '1ef1ed6449a50fab8cefcd73377d0ac3';

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'SoulChain',
        description: 'Anonymous Emotional Journaling on Web3',
        url: 'https://soulchain.app',
        icons: ['https://soulchain.app/icon.png'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}