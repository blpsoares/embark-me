# Learning - Study Challenges

Interactive study app with multiple quiz types, flashcards, and Notion integration.

## Quiz Types

The app supports 5 types of quizzes, all stored as JSON files in `public/quizzes/`.

### 1. Flashcard

Classic study flashcards with 3D flip animation.

```json
{
  "type": "flashcard",
  "questions": [
    {
      "pergunta": "What is the Virtual DOM?",
      "resposta": "A lightweight representation of the real DOM used by React to optimize UI updates."
    }
  ]
}
```

### 2. Multiple Choice

Questions with multiple options, only one correct answer.

```json
{
  "type": "multiple-choice",
  "questions": [
    {
      "pergunta": "What is the type of `typeof null` in JavaScript?",
      "resposta": "B",
      "opcoes": [
        { "opcao": "A", "descricao": "null" },
        { "opcao": "B", "descricao": "object" },
        { "opcao": "C", "descricao": "undefined" },
        { "opcao": "D", "descricao": "string" }
      ]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pergunta` | string | The question text |
| `resposta` | string | Correct option letter (e.g. "A", "B") |
| `opcoes` | array | Array of `{ opcao: string, descricao: string }` |

### 3. True or False

Statements that are either true or false, with optional explanation.

```json
{
  "type": "true-false",
  "questions": [
    {
      "pergunta": "HTML is a programming language.",
      "resposta": false,
      "explicacao": "HTML is a markup language (HyperText Markup Language), not a programming language."
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pergunta` | string | The statement |
| `resposta` | boolean | `true` or `false` |
| `explicacao` | string? | Optional explanation shown after answering |

### 4. Fill in the Blank

Type the answer. Comparison is case-insensitive and trimmed.

```json
{
  "type": "fill-blank",
  "questions": [
    {
      "pergunta": "To clone a repository, use: git ___",
      "resposta": "clone",
      "alternativas": ["clone"]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pergunta` | string | Question with blank (use `___` to indicate) |
| `resposta` | string | The correct answer |
| `alternativas` | string[]? | Optional alternative accepted answers |

### 5. Match Pairs

Connect terms to their definitions. Terms appear on the left, shuffled definitions on the right.

```json
{
  "type": "match-pairs",
  "questions": [
    {
      "pairs": [
        { "termo": "200", "definicao": "OK - Successful request" },
        { "termo": "404", "definicao": "Not Found" },
        { "termo": "500", "definicao": "Internal Server Error" }
      ]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pairs` | array | Array of `{ termo: string, definicao: string }` |

> **Note:** Match Pairs uses a single question object containing all pairs. The `questions` array should have one element.

## Adding a New Quiz

1. Create a JSON file in `public/quizzes/` following one of the schemas above
2. Add an entry to `public/quizzes/manifest.json`:

```json
{
  "id": "my-quiz-id",
  "type": "multiple-choice",
  "title": { "pt": "Meu Quiz", "en": "My Quiz" },
  "description": { "pt": "Descricao do quiz", "en": "Quiz description" },
  "icon": "code",
  "tags": ["tag1", "tag2"],
  "file": "my-quiz-file.json",
  "questionCount": 10
}
```

3. Commit and deploy

### Manifest Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (used in URL: `/study/{id}`) |
| `type` | string | One of: `flashcard`, `multiple-choice`, `true-false`, `fill-blank`, `match-pairs` |
| `title` | object | `{ pt: string, en: string }` — localized title |
| `description` | object | `{ pt: string, en: string }` — localized description |
| `icon` | string | Icon name from lucide-react (e.g. `code`, `brain`, `cloud`, `server`, `sparkles`) |
| `tags` | string[] | Tags for categorization |
| `file` | string | JSON filename inside `public/quizzes/` |
| `questionCount` | number | Number of questions (shown on card) |

### Custom Upload

Users can also drag-and-drop CSV/JSON files directly on the study page for a one-time session. These are not persisted.

## Development

```bash
bun install
bun run --filter @embark/learning dev
```

## Tech Stack

- **React** + **TypeScript** (strict mode)
- **Vite** for dev/build
- **Tailwind CSS v4** for styling
- **react-router-dom** (HashRouter)
- **lucide-react** for icons
- **i18n** — built-in pt/en support
