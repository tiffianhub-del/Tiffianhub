# GitHub Authentication Fix

## Problem
You're getting a 403 permission denied error when trying to push to the repository.

## Solutions

### Option 1: Use Personal Access Token (Recommended - Quick Fix)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "Tiffianhub Development"
   - Select the `repo` scope (this gives full repository access)
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately (you won't see it again!)

2. **Use the token when pushing:**
   - When Git asks for your password, use the token instead
   - Or update the remote URL to include your username:
     ```bash
     git remote set-url origin https://Nartyanaman@github.com/tiffianhub-del/Tiffianhub.git
     ```
   - Then when prompted, use your token as the password

3. **Using Git Credential Manager (Windows - Automatic):**
   - When you run `git push`, Windows Credential Manager will automatically prompt you
   - **Username:** `Nartyanaman` (your GitHub username)
   - **Password:** Paste your personal access token (NOT your GitHub password)
   - Check "Remember my credentials" to save it for future pushes
   - The credentials will be stored in Windows Credential Manager

### Option 2: Set Up SSH (More Secure - Long-term Solution)

1. **Check if you have SSH keys:**
   ```bash
   ls ~/.ssh
   ```

2. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "123141276+Nartyanaman@users.noreply.github.com"
   ```
   - Press Enter to accept default location
   - Optionally set a passphrase (or press Enter for no passphrase)

3. **Add SSH key to GitHub:**
   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

4. **Change remote to use SSH:**
   ```bash
   git remote set-url origin git@github.com:tiffianhub-del/Tiffianhub.git
   ```

5. **Test the connection:**
   ```bash
   ssh -T git@github.com
   ```
   - Should see: "Hi Nartyanaman! You've successfully authenticated..."

### Option 3: Check Repository Access

If you don't have write access to `tiffianhub-del/Tiffianhub`:
- You may need to fork the repository first
- Or ask the repository owner to add you as a collaborator
- Or push to your own fork instead

## Quick Test After Setup

```bash
git push
```

If it still fails, try:
```bash
git push -u origin main
```
(or `master` if that's your branch name)

## Troubleshooting

- **Still getting 403?** Make sure you're using the token, not your GitHub password
- **SSH not working?** Check that your SSH key is added to GitHub
- **Permission denied?** Verify you have write access to the repository

