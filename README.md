# HyperDID - Standard Document Structure

This repository defines the official structure and context for **HyperDID Documents**, used by the `did:hyper:` resolver.

## 🔧 Purpose

The goal is to establish a consistent format for HyperDID documents (HyperDIDDoc), enabling the resolver to:

- Validate document structure via JSON Schema.
- Understand and extract a list of associated DIDs.
- Ensure forward compatibility and reliable resolution logic.

## 📘 Structure

Every valid HyperDIDDoc **must include** the following fields:

| Field       | Type     | Description |
|-------------|----------|-------------|
| `@context`  | string   | Must be: `https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld` |
| `version`   | integer  | Fixed to `1` for now |
| `id`        | string   | Unique internal identifier (e.g., `"pepe"`) |
| `controller`| string   | Ethereum address of the owner (e.g., `"0xabc123..."`) |
| `timestamp` | string   | ISO timestamp of the last update |
| `counter`   | integer  | Document version number (increases on each update) |
| `dids`      | object   | Map of DID keys (e.g. `default`, `github`, etc) with at least one `default` entry |
| `proof`     | object   | Signature proof using `EcdsaSecp256k1Signature2019` |

Example:
```json
{
  "@context": "https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld",
  "version": 1,
  "id": "pepe",
  "controller": "0xC4a5bfA8b0C3eC5Fbda80AA46e00212D55b8A7b8",
  "timestamp": "2025-06-06T12:00:00Z",
  "counter": 3,
  "dids": {
    "default": "did:ethr:0xabc123..."
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-06-06T12:00:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "0xC4a5bfA8b0C3eC5Fbda80AA46e00212D55b8A7b8",
    "jws": "..."
  }
}

## 🧪 Validation

- **JSON Schema**: [hyperdiddoc-v1.json](https://lluisetcaganer.github.io/hyperdid/schemas/hyperdiddoc-v1.json)
- **Context**: [hyperdid-v1.jsonld](https://lluisetcaganer.github.io/hyperdid/contexts/hyperdid-v1.jsonld)

## 📁 Structure

- `schemas/`: JSON Schema definitions
- `contexts/`: JSON-LD context
- `examples/`: Sample valid documents

## 💡 Notes

- The `default` key in `dids` is **required** and defines the primary DID.
- Future versions may expand the context or structure.

