# DevOps Study Dashboard

A simple React-based dashboard for browsing DevOps study materials related to AWS and GCP.

## Features

- Browse AWS and GCP documentation in Markdown format
- View PDF resources
- Search functionality
- Responsive design
- Dark mode toggle
- Collapsible sidebar

## Project Structure

```
dashboard/
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── app.js             # React application code
└── README.md          # Project documentation
```

## How to Use

1. Open the `index.html` file in a web browser
2. Use the sidebar to navigate between different documentation files
3. Use the search bar to filter documents
4. Toggle dark mode using the moon/sun icon
5. Collapse the sidebar for more reading space

## Implementation Notes

- This dashboard is a client-side only application using React
- Content is loaded from the GitHub repository
- PDF files are displayed using an embedded Google Docs viewer
- Markdown files are rendered using the markdown-it library

## Future Improvements

- Add a table of contents for each document
- Implement full-text search across all documents
- Add bookmarking functionality
- Implement a history feature
- Add syntax highlighting for code blocks
