import subprocess

# Get the list of commits that haven't been pushed yet (from oldest to newest)
result = subprocess.run('git log origin/main..main --format="%H" --reverse', shell=True, capture_output=True, text=True)
commits = [c for c in result.stdout.strip().split('\n') if c]

if not commits:
    print("No commits to push.")
else:
    print(f"Found {len(commits)} commits to push. Pushing one by one...")

for i, commit in enumerate(commits):
    print(f"Pushing commit {i+1}/{len(commits)}: {commit[:7]}")
    push_res = subprocess.run(f'git push origin {commit}:refs/heads/main', shell=True, capture_output=True, text=True)
    if push_res.returncode != 0:
        print(f"Failed to push {commit}: {push_res.stderr}")
        break
    else:
        print(f"Successfully pushed {commit[:7]}")

print("Done incremental push script.")
