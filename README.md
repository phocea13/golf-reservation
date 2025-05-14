# Chrome CLI Tool

This project is a command line tool that automates the process of opening a Chrome browser window, authenticating on a specified website, navigating to a designated page, and reserving a time slot.

## Features

- **Authentication**: Handles user login on the specified website.
- **Navigation**: Directs the browser to the desired page after authentication.
- **Reservation**: Clicks to reserve a specified time slot on the page.

## Project Structure

```
chrome-cli-tool
├── src
│   ├── index.ts                # Entry point of the command line tool
│   ├── services
│   │   ├── authService.ts      # Authentication service
│   │   ├── navigationService.ts # Navigation service
│   │   └── reservationService.ts # Reservation service
│   ├── utils
│   │   └── browserUtils.ts      # Utility functions for browser operations
│   └── types
│       └── index.ts            # Type definitions for authentication and reservation
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chrome-cli-tool
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the command line tool, use the following command:
```
npm start
```

Make sure to provide the necessary command line arguments for authentication and reservation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.