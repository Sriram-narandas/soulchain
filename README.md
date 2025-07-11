# SoulChain - Anonymous Emotional Journaling dApp

SoulChain is a Web3 journaling dApp that combines encrypted emotional expression with a reel-style feed and private community SoulCircles—all powered by blockchain technology.

## 🌟 Features

- **Anonymous Journaling**: Express your deepest thoughts with privacy-first encryption
- **Reel-Style Feed**: Instagram-inspired vertical scrolling experience
- **SoulCircles**: Join anonymous emotional communities for support and growth
- **Wallet Integration**: Connect via MetaMask/WalletConnect for full access
- **Mood Analytics**: Track your emotional patterns over time
- **Encrypted Storage**: Client-side AES encryption with IPFS storage
- **Responsive Design**: Beautiful glassmorphism UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI (shadcn/ui)
- **Web3**: Wagmi, Viem
- **State Management**: Zustand
- **Encryption**: CryptoJS (AES-256)
- **Storage**: IPFS for decentralized data
- **Blockchain**: BNB Chain (BSC)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/soulchain.git
   cd soulchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your configuration values:
   - WalletConnect Project ID
   - IPFS API credentials
   - Smart contract addresses
   - Firebase config (optional)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000** in your browser

## 🔐 Privacy & Security

- **Client-side encryption**: All journal entries are encrypted locally before storage
- **Wallet-based keys**: Encryption keys derived from wallet signatures
- **No personal data**: Anonymous by design - no profiles, usernames, or tracking
- **Decentralized storage**: IPFS ensures data permanence and censorship resistance

## 🎨 Design Philosophy

SoulChain prioritizes emotional well-being over engagement metrics:
- ❌ No likes, comments, or followers
- ❌ No public profiles or usernames
- ❌ No algorithmic manipulation
- ✅ Focus on reflection and healing
- ✅ Anonymous community support
- ✅ Beautiful, calming interface

## 📱 User Experience

### Wallet Users (Full Access)
- Create encrypted journal entries
- Join and create SoulCircles
- Access personal dashboard and analytics
- Earn $SOUL tokens for journaling streaks

### Guest Users (View Only)
- Browse public entries and circles
- Limited access to encourage wallet connection
- Can upgrade to full experience anytime

## 🔮 Smart Contracts

SoulChain uses three main smart contracts on BNB Chain:

1. **SoulEntry.sol**: Manages journal entry metadata and IPFS hashes
2. **SoulCircle.sol**: Handles community creation and membership
3. **SoulToken.sol**: ERC-20 token for rewards and governance

## 🌈 SoulCircles

Anonymous communities for emotional support:
- **Grief Circle**: Processing loss and healing
- **Love Letters**: Gratitude and appreciation
- **Breakthroughs**: Personal growth moments
- **Midnight Thoughts**: Deep introspection
- **Creative Souls**: Artistic expression

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered mood insights
- [ ] Voice journaling with speech-to-text
- [ ] Integration with mental health resources
- [ ] Advanced analytics and data visualization
- [ ] Cross-chain compatibility

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with love for mental health and emotional well-being
- Inspired by the need for private, meaningful digital spaces
- Powered by the decentralized web and blockchain technology

---

**SoulChain** - Where emotions meet permanence, and healing happens in community. 🔗💜