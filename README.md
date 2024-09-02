Here’s the final version of the README section with the provided URLs included:

---

## **📄 README for SplitXchange**

### **🚀 Project Overview**

SplitXchange is a sophisticated, next-generation expense-sharing application designed to cater to the needs of a global audience. It seamlessly handles the complexities of splitting expenses across multiple users and currencies, including both fiat and cryptocurrencies. SplitXchange empowers users with robust features such as flexible expense splitting, secure group management, and advanced authentication, making it a comprehensive solution for both personal and group financial management on a global scale.

Link : https://spotless-homburg-122.notion.site/SplitXchange-Simplified-Splits-Universal-Exchange-6b40789cc69c454595129143ba107cbe

### **📂 Code Submission**

- **Repository:** [GitHub Link or ZIP File]
- **Branch:** `main`
- **GitHub Repository:** [https://github.com/NithinJ-17/splitwise-app.git](https://github.com/NithinJ-17/splitwise-app.git)

### **🔧 Running the Application Locally**

To run the application locally, follow these steps:

1. **Build the Docker Image:**
   ```bash
   docker build -t splitwise-app .
   ```

2. **Run the Docker Container:**
   ```bash
   docker run -p 3000:3000 -p 8000:8000 splitwise-app
   ```

3. **Configure Git to Use Unix-Style Line Endings:**
   ```bash
   git config --global core.autocrlf input
   ```

Ensure that any shell scripts you write use Unix-style line endings (LF) instead of Windows-style line endings.

### **📦 Database Seeding**

Database seeding is automated and managed in the cloud, ensuring that users can sign up and immediately start using all the features of SplitXchange without the need for manual database setup. This seamless onboarding experience reflects the cutting-edge design of SplitXchange, prioritizing user convenience and operational efficiency.

### **📚 Sample Transaction Data**

In SplitXchange, transactions are meticulously recorded and handled with precision across various currencies. Below are examples of transactions that demonstrate the application's flexibility and power:

- **10/Jun Office Team Lunch @ Fancy Place**
  - **Currency:** USD
  - **Amount:** 1000
  - **Share:** -250 (Debit)
- **11/Jun Dinner Meeting with Investors @ Tokyo Sushi**
  - **Currency:** JPY
  - **Amount:** 70000
  - **Share:** +20000 (Credit)
- **12/Jun Cross-Platform Development Workshop**
  - **Currency:** EUR
  - **Amount:** 500
  - **Share:** -150 (Debit)
- **15/Jun Crypto Strategy Session**
  - **Currency:** BTC
  - **Amount:** 0.01 BTC
  - **Share:** -0.0025 BTC (Debit)
- **20/Jun Global Partnership Summit**
  - **Currency:** GBP
  - **Amount:** 800
  - **Share:** +300 (Credit)

These transactions showcase how SplitXchange handles multi-currency and cryptocurrency transactions, offering users unparalleled flexibility in managing their global finances.

### **🗄️ Database Selection Rationale**

- **Database Chosen:** MongoDB
- **Reason:** MongoDB was selected for its ability to effortlessly handle the complex and varied data structures inherent in a global expense-sharing platform. SplitXchange requires a database that can dynamically adapt to different currencies, including volatile cryptocurrencies like Bitcoin and Ethereum, without compromising on performance or scalability. MongoDB's document-oriented structure allows for the seamless management of these diverse data types, ensuring that user data is stored and retrieved efficiently, regardless of its complexity.

  - **Global Financial Transactions:** MongoDB's ability to scale horizontally ensures that SplitXchange can handle transactions across different continents, maintaining high availability and performance, even as the number of users and transactions grows exponentially.
  - **Cryptocurrency Support:** The flexibility to store and process various forms of currency, including cryptocurrencies, within the same database model, without needing rigid schemas, is crucial for SplitXchange's ability to support the future of financial transactions.

### **🗂️ Basic Data Schema**

SplitXchange’s data models are meticulously structured to ensure integrity, performance, and scalability across a wide array of financial scenarios. Below is an overview of the core models and their relationships within MongoDB:

- **Documents:**
  - **Users:** Manages user profiles, authentication details, and group memberships. Users can operate in multiple currencies and interact with various groups and expenses.
  - **Expenses:** Central to the application, this document records every expense, detailing the amount, currency, and the users involved. Each expense is linked to its participants and, if applicable, to a specific group.
  - **Groups:** Facilitates the management of group expenses. Each group document includes the group's members and references all associated expenses, supporting complex financial relationships within teams, families, or other collective entities.
  - **Settlements:** Ensures that balances between users are accurately tracked and resolved. The settlement document records the payer, payee, amount, and currency, often involving international transactions or cryptocurrency settlements.

- **Relationships:**
  - **Users and Groups:**
    - A user can be a member of multiple groups, and a group can have multiple users. This many-to-many relationship is efficiently managed through references within the `Users` and `Groups` documents, ensuring that group dynamics and membership changes are handled seamlessly.
  - **Users and Expenses:**
    - Expenses can be shared between multiple users, with each user contributing to or benefitting from the transaction. The `Expenses` document references all users involved, managing their respective shares, whether in fiat or cryptocurrency.
  - **Groups and Expenses:**
    - Groups facilitate collective financial activities, with each group being linked to its relevant expenses. The `Groups` document maintains references to all associated `Expenses`, ensuring that group financial activities are transparently tracked.
  - **Users and Settlements:**
    - Settlements formalize the resolution of balances between users. Each `Settlement` document references the users involved, capturing the financial exchange, whether it’s in USD, JPY, BTC, or any other supported currency.

- **Access Patterns:**
  - SplitXchange optimizes data access for key operations such as retrieving all expenses a user is involved in, calculating outstanding balances, and managing group activities. These operations are crucial for providing users with real-time insights into their financial standings and ensuring that all transactions are accurately reflected across the system.

### **🌐 Deployed Application**

- **URL:** [http://splitxchange-dev.ap-south-1.elasticbeanstalk.com/](http://splitxchange-dev.ap-south-1.elasticbeanstalk.com/)
- Access the live application at the above URL.

### **🔗 API Endpoints**

For a comprehensive list of API endpoints, along with example requests and responses, please refer to the following Postman documentation:

[SplitXchange API Documentation](https://documenter.getpostman.com/view/36755637/2sAXjM3reZ)

### **📚 Conclusion&Thesis**

SplitXchange sets a new standard in expense-sharing applications by combining the flexibility of multiple currency support, including cryptocurrencies, with robust group management and secure user authentication. This project is not just a financial tool but a comprehensive platform designed to meet the needs of a global, interconnected audience. The detailed API documentation and meticulously structured data models ensure that SplitXchange is both scalable and adaptable, ready to handle the financial complexities of the modern world.
Link : https://spotless-homburg-122.notion.site/SplitXchange-Simplified-Splits-Universal-Exchange-6b40789cc69c454595129143ba107cbe

---

Let me know if there are any final changes you'd like to make!