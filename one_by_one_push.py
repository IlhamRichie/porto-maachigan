import os
import subprocess
import time

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result

print("Resetting commits back to origin/main...")
run_cmd("git reset origin/main")

print("Getting list of modified/untracked assets...")
result = run_cmd("git status --porcelain")
files = []
for line in result.stdout.strip().split('\n'):
    if line:
        parts = line.split(maxsplit=1)
        if len(parts) == 2:
            file_path = parts[1].strip('"')
            if file_path.startswith('assets/'):
                files.append(file_path)

print(f"Found {len(files)} files to commit and push one by one.")

for i, f in enumerate(files):
    print(f"[{i+1}/{len(files)}] Processing {f}...")
    run_cmd(f'git add "{f}"')
    
    commit_res = run_cmd(f'git commit -m "chore: add asset {os.path.basename(f)}"')
    if commit_res.returncode != 0:
        print("  Nothing to commit or error.")
        continue
        
    print("  Pushing...")
    push_res = run_cmd('git push origin main')
    
    retries = 3
    while push_res.returncode != 0 and retries > 0:
        print(f"  Push failed, retrying in 5s... ({retries} left)")
        time.sleep(5)
        push_res = run_cmd('git push origin main')
        retries -= 1
        
    if push_res.returncode == 0:
        print("  Pushed successfully.")
    else:
        print(f"  Failed to push {f} after retries. Stopping script.")
        break

print("Done one-by-one push script.")
