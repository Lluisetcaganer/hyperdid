# HyperDID — Decentralized Identifier Registry & Document Standard

This repository defines the official structure and resolution logic for **`did:hyper:<id>`** identifiers, including:

- 📄 The **HyperDID Document** structure and its JSON-LD context.
- 📦 The smart contract (`HyperDIDRegistry.sol`) used to manage ID ownership and resolution.
- 🧩 A TypeScript-based **library and resolver** to interact with the system (Node.js and browser compatible).
- 🧪 A local development UI using **Vite** and **Metamask**.

---

## 🔧 Purpose

The **HyperDID** project introduces a simple, permissionless way to register and resolve human-readable DIDs using a single smart contract and a linked document format. It enables:

- ✅ Full user control of identity records (`did:hyper:<id>`)
- 🔐 Secure EIP-712-based signature verification
- 🧭 Resolution to other DID methods (`did:ethr`, `did:web`, etc.)
- 🧱 An extendable DID-document format (`HyperDIDDoc`)

---

## 📘 HyperDID Document Specification

Each `did:hyper:<id>` must resolve to a valid **HyperDID Document** hosted at an IPFS or HTTPS pointer. The document must follow this structure:

```json
{
  "@context": "https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld",
  "version": 1,
  "id": "pepe",
  "controller": "0xC4a5bfA8b0C3eC5Fbda80AA46e00212D55b8A7b8",
  "timestamp": "2025-06-06T12:00:00Z",
  "counter": 3,
  "dids": {
    "default": "did:ethr:0xabc123...",
    "github": "did:web:github.com/..."
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-06-06T12:00:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "0xC4a5bfA8b0C3eC5Fbda80AA46e00212D55b8A7b8",
    "jws": "..."
  }
}
```
### 🔍 Key Fields

| Field         | Type     | Description |
|---------------|----------|-------------|
| `@context`    | string   | Must be: `https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld` |
| `version`     | integer  | Must be `1` (current document version) |
| `id`          | string   | Human-readable identifier (e.g., `alice`, `bob`) |
| `controller`  | string   | Ethereum address of the document's owner |
| `timestamp`   | string   | ISO 8601 timestamp indicating when the document was last signed |
| `counter`     | integer  | Incremented version number (for future validation) |
| `dids`        | object   | Map of tags to DIDs (`default`, `sign`, etc.) |
| `proof`       | object   | EIP-712 signature metadata and JWS string |

---

## 🧩 Validation Tools

- **JSON Schema**: [`hyperdiddoc-v1.json`](https://lluisetcaganer.github.io/hyperdid/schemas/hyperdiddoc-v1.json)
- **JSON-LD Context**: [`hyperdid-v1.jsonld`](https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld)

---

## 📁 Repository Structure

```bash
hyperdid/
├── index.html             # Frontend entry point (browser)
├── vite.config.ts         # Vite config
├── abi.json               # Compiled smart contract ABI
├── contracts/
│   └── HyperDIDRegistry.sol  # Smart contract source
└── src/
    ├── index.ts           # CLI interface to test resolution
    ├── resolver.ts        # Resolution logic for did:hyper and DID aliases
    ├── signer.ts          # EIP-712 document signer
    ├── transact.ts        # Contract registration/update/transfer helpers
    └── types.ts           # TypeScript types and constants


## 🧪 Local Testing & Development

To test the **HyperDID** project locally (Metamask + Vite required):

### 1. Clone the repository

```bash
git clone https://github.com/Lluisetcaganer/hyperdid
cd hyperdid
```
### 2. Install dependencies

```bash
npm install
```
### 3. Ensure package.json includes the following scripts

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```
### 4. Install dependencies

```bash
npm run dev
```
### 5. Open your browser
Visit: http://localhost:5173

Make sure that:

✅ Metamask is installed and connected

🌐 You are on the Sepolia network
