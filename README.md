# delete-nodes

An ultra-lightweight CLI tool to clean up all `node_modules` folders scattered throughout your system home directory. Free up disk space and declutter your developer environment—quickly and effortlessly.

---

## Features

- **System-wide scan within your home directory** — finds all `node_modules` folders across projects.
- **Safe deletion** — removes only the detected `node_modules` directories, without touching your code or project files.
- **Zero setup required** — just run it using `npx`, no installation hassles.

---

## Installation & Usage

```bash
npx delete-nodes
```

This command will:

1. Scan your home directory for all `node_modules` subfolders.
2. Prompt you (optional) or automatically delete them.
3. Reclaim valuable disk space.

---

## Why Use delete-nodes?

- Node.js projects often leave behind bulky `node_modules` folders.
- These folders grow quickly and clutter your system.
- `delete-nodes` offers a clean, one-step cleanup tool tailored for speed and simplicity.

---

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourAwesomeFeature
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourAwesomeFeature
   ```
5. Open a pull request and we’ll review it!

---

## License

[MIT License](LICENSE) – Feel free to use, modify, and distribute!
