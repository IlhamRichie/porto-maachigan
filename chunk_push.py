import os
import subprocess

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Failed to run: {cmd}")
        print(result.stderr)
    return result

print("Undo last massive commit...")
run_cmd("git reset HEAD~1")

print("Commit code changes first...")
run_cmd("git add index.html css/styles.css js/script.js")
run_cmd('git commit -m "feat: implement base styles and layout"')

print("Committing assets in batches...")
assets_dir = "assets"
if os.path.exists(assets_dir):
    files = [os.path.join(assets_dir, f) for f in os.listdir(assets_dir) if os.path.isfile(os.path.join(assets_dir, f))]
    
    # Chunk into 5 files per commit to keep sizes very small
    chunk_size = 5
    for i in range(0, len(files), chunk_size):
        chunk = files[i:i+chunk_size]
        for f in chunk:
            run_cmd(f'git add "{f}"')
        
        run_cmd(f'git commit -m "chore: add assets batch {i//chunk_size + 1}"')
        print(f"Committed batch {i//chunk_size + 1} ({len(chunk)} files)")

print("Pushing all commits to remote...")
push_result = subprocess.run("git push origin main", shell=True, capture_output=True, text=True)
if push_result.returncode == 0:
    print("Push successful!")
else:
    print("Push failed with error:")
    print(push_result.stderr)
