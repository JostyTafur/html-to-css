# CSS through HTML Extension for Visual Studio Code

The **CSS through HTML** extension for Visual Studio Code simplifies the process of creating CSS styles from classes and IDs defined in HTML files. This tool allows you to quickly generate CSS rules, improving efficiency in the development of your web projects.

## SUPPORT FOR:

- HTML
- REACT
- ANGULAR
- VUE
- SVELTE
- ASTRO

## Features

- **Quick Style Creation:** Automatically generates CSS rules from classes and IDs found in the selected HTML code.

- **Support for Classes and IDs:** Recognizes both classes (`class`) and IDs (`id`) in the HTML code.

- **CSS File Creation:** Automatically creates CSS files in the same folder as the active HTML file if they do not exist.

- **CSS Tag Creation:** Automatically crear CSS style tag in the same file for Vue, Astro or Svelte components 

## Usage Instructions

1. Select the HTML code from which you want to generate CSS styles.

2. Run the extension from the Visual Studio Code command menu or through the right-click context menu.
   - For a specific selection, use the command `CSS through HTML: Include on CSS`.
      - **For files that use CSS in a separate file (HTML, React, Angular)**
      ![](https://raw.githubusercontent.com/JostyTafur/html-to-css/master/assets/IncludeOneFile.gif)

      - **For files that use the style tag in the same file (Vue, Svelte, Astro)**
      ![](https://raw.githubusercontent.com/JostyTafur/html-to-css/master/assets/IncludeOneTag.gif)

   - To generate styles from the entire HTML content, use `CSS through HTML: Include All CSS`.
      - **For files that use CSS in a separate file (HTML, React, Angular)**
      ![](https://raw.githubusercontent.com/JostyTafur/html-to-css/master/assets/IncludeAllFile.gif)

      - **For files that use the style tag in the same file (Vue, Svelte, Astro)**
      ![](https://raw.githubusercontent.com/JostyTafur/html-to-css/master/assets/IncludeAllTag.gif)

3. The extension will automatically create CSS rules based on the classes and IDs found.

4. The styles will be inserted into an existing CSS file or a new one will be created in the same folder as the active HTML file.

## Contributions
If you encounter any issues or have suggestions to improve the extension, feel free to open an [issue](https://github.com/JostyTafur/html-to-css) on our GitHub repository. We welcome collaborations!
