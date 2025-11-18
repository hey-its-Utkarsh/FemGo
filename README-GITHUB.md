
# How to Push This Project to GitHub

This is a step-by-step guide to get your FemGo project code onto your own GitHub account. Follow these instructions carefully.

---

### Part 1: Create a Home for Your Code on GitHub

First, you need to create an empty repository (a project folder) on the GitHub website.

1.  **Go to GitHub**: Open your web browser and go to [https://github.com/new](https://github.com/new).
2.  **Name Your Repository**: Give your new repository a name. A good name would be `femgo-app`.
3.  **Choose Privacy**: You can make it "Public" (anyone can see it) or "Private" (only you can see it). "Public" is great for sharing your work.
4.  **IMPORTANT**: **Do not** check any of the boxes to "Initialize this repository with a README," ".gitignore," or a "license." Your project already has these files.
5.  **Create It**: Click the green **"Create repository"** button.

After you create it, GitHub will show you a page with a URL. **Keep this page open!** You will need to copy the URL soon. It will look like this: `https://github.com/your-username/femgo-app.git`.

---

### Part 2: Upload Your Project Using the Terminal

Next, you will use your computer's command line (the "terminal") to upload your project.

1.  **Initialize Git**: Open your terminal in this project's directory and run this command. It prepares your project folder for Git.
    ```bash
    git init -b main
    ```

2.  **Add Your Files**: This command stages all your files to be uploaded.
    ```bash
    git add .
    ```

3.  **Save Your Files (Commit)**: This command creates a "save point" for your files with a descriptive message.
    ```bash
    git commit -m "Initial commit of FemGo project"
    ```

4.  **Connect to Your GitHub Repo**: Go back to the GitHub page you kept open and copy the repository URL. Then, run the command below, replacing `YOUR_REPOSITORY_URL_HERE` with the URL you copied.
    ```bash
    git remote add origin YOUR_REPOSITORY_URL_HERE
    ```
    *Example: `git remote add origin https://github.com/your-username/femgo-app.git`*


5.  **Push (Upload) Your Code**: This is the final step that sends all your files to GitHub.
    ```bash
    git push -u origin main
    ```

**You're done!** Refresh your GitHub repository page, and you will see all your project files there. You have successfully pushed your project to GitHub.
