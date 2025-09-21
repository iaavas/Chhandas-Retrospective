## Chhandas Retrospective


Chhandas Retrospective is a web application designed to explore, analyze, and appreciate the poetic meters (chhandas) found in Nepali literature. Built with React and Vite, it provides an interactive platform for users to learn about different chhandas, view examples, and understand their structure.

**Supported Chhandas (Meters) for Analysis:**

The app can check and analyze the following Nepali meters:

| Name (Nepali)         | Pattern (Gana Sequence)                |
|------------------------|----------------------------------------|
| भुजङ्गप्रयात           | ISS, ISS, ISS, ISS                     |
| शार्दूलविक्रीडित        | SSS, IIS, ISI, IIS, SSI, SSI, S        |
| तोटक                  | IIS, IIS, IIS, IIS                     |
| मन्दाक्रान्ता           | SSS, SII, III, SSI, SSI, S, S          |
| इन्द्रवज्र              | SSI, SSI, ISI, SS                      |
| उपेन्द्रवज्र            | ISI, SSI, ISI, SS                      |
| वंशस्थ                 | ISI, SSI, ISI, SIS                     |
| इन्द्रवंश               | SSI, SSI, ISI, SIS                     |
| वसन्ततिलका             | SSI, SII, ISI, ISI, SS                  |
| मालिनी                 | III, III, SSS, ISS, ISS                |
| शिखरिणी                | ISS, SSS, III, IIS, SII, I, S          |
| स्रग्विणी               | SIS, SIS, SIS, SIS                     |
| स्रग्धरा                | SSS, SIS, SII, III, ISS, ISS, ISS      |
| पृथ्वी                  | III, III, SSS, ISS, ISS, III, III, SSS, ISS, ISS |
| द्रुतविलम्बित           | III, SII, SII, SIS                     |
| हरिणी                  | III, IIS, SSS, SIS, IIS, IS            |
| अनुष्टुप्               | (Special rules)                        |
| मात्रिक१४               | (14 Matras)                            |
| आर्या                   | (Special Matra rules)                  |

See the [About](#about) section or the About page in the app for more details on each meter.

> **Inspired by:** [छन्दमा कविता कसरी लेख्ने? (How to write poetry in Chhanda)](https://medium.com/@shivagaire/%E0%A4%9B%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%AE%E0%A4%BE-%E0%A4%95%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A4%BE-%E0%A4%95%E0%A4%B8%E0%A4%B0%E0%A5%80-%E0%A4%B2%E0%A5%87%E0%A4%96%E0%A5%8D%E0%A4%A8%E0%A5%87-7782c0a01967) by Shiva Gaire

## Features

- **Chhandas Explorer:** Browse and learn about various Nepali poetic meters.
- **Interactive UI:** Modern, responsive design for seamless user experience.
- **About Section:** Information about the project and its purpose.
- **Navigation Bar:** Easy access to different sections of the app.
- **Utilities:** Core logic for chhandas analysis and constants for reference.

<p align="center">
	<img src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Nepali Poetry Illustration" width="400" />
	<br>
	<em>Illustration: The beauty of Nepali poetry and meter</em>
</p>

## Technologies Used

- [React](https://react.dev/) – UI library
- [Vite](https://vitejs.dev/) – Fast build tool
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) – Styling


## Project Structure

```text
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── utils/
│   │   ├── chhandas.ts
│   │   └── constant.ts
│   ├── About.css
│   ├── About.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── Navbar.css
│   ├── Navbar.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

## Getting Started


### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn


### Installation

```bash
# Clone the repository
git clone https://github.com/iaavas/Chhandas-Retrospective.git
cd Chhandas-Retrospective

# Install dependencies
npm install
```


### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.


### Building for Production

```bash
npm run build
```


## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.


## License

This project is licensed under the MIT License.


## Acknowledgements

- Nepali literature and chhandas scholars
- [छन्दमा कविता कसरी लेख्ने?](https://medium.com/@shivagaire/%E0%A4%9B%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%AE%E0%A4%BE-%E0%A4%95%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A4%BE-%E0%A4%95%E0%A4%B8%E0%A4%B0%E0%A5%80-%E0%A4%B2%E0%A5%87%E0%A4%96%E0%A5%8D%E0%A4%A8%E0%A5%87-7782c0a01967) by Shiva Gaire


---

<p align="center">
	<strong>Explore the beauty of Nepali poetry with Chhandas Retrospective!</strong>
</p>