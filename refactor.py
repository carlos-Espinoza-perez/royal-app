import re

css_path = "src/styles/global.css"
with open(css_path, "r", encoding="utf-8") as f:
    content = f.read()

# Font Sizes
content = re.sub(r'font-size:\s*0\.7[0-9]rem;', 'font-size: var(--text-xs);', content)
content = re.sub(r'font-size:\s*0\.8[0-9]rem;', 'font-size: var(--text-sm);', content)
content = re.sub(r'font-size:\s*1rem;', 'font-size: var(--text-base);', content)
content = re.sub(r'font-size:\s*1\.1rem;', 'font-size: var(--text-lg);', content)
content = re.sub(r'font-size:\s*1\.25rem;', 'font-size: var(--text-xl);', content)
content = re.sub(r'font-size:\s*1\.5rem;', 'font-size: var(--text-2xl);', content)

# Gaps
content = re.sub(r'gap:\s*0\.[1-4][0-9]rem;', 'gap: var(--space-xs);', content)
content = re.sub(r'gap:\s*0\.[5-7][0-9]rem;', 'gap: var(--space-sm);', content)
content = re.sub(r'gap:\s*0\.8[0-9]rem;', 'gap: var(--space-md);', content)
content = re.sub(r'gap:\s*1rem;', 'gap: var(--space-md);', content)
content = re.sub(r'gap:\s*1\.[1-9]rem;', 'gap: var(--space-lg);', content)

# Paddings (simple ones)
content = re.sub(r'padding:\s*1rem;', 'padding: var(--space-md);', content)
content = re.sub(r'padding:\s*1\.[1-4]rem;', 'padding: var(--space-lg);', content)
content = re.sub(r'padding:\s*0\.[7-9]rem;', 'padding: var(--space-md);', content)
content = re.sub(r'padding:\s*0\.[4-6]rem;', 'padding: var(--space-sm);', content)
content = re.sub(r'padding:\s*0 1rem 1rem;', 'padding: 0 var(--space-md) var(--space-md);', content)

# Margins
content = re.sub(r'margin-top:\s*0\.[1-4]rem;', 'margin-top: var(--space-xs);', content)
content = re.sub(r'margin-top:\s*0\.[5-9]rem;', 'margin-top: var(--space-sm);', content)
content = re.sub(r'margin-top:\s*1rem;', 'margin-top: var(--space-md);', content)
content = re.sub(r'margin-bottom:\s*0\.[7-9]rem;', 'margin-bottom: var(--space-md);', content)
content = re.sub(r'margin-bottom:\s*1rem;', 'margin-bottom: var(--space-md);', content)

# Fix inputs mobile first 16px minimum
content = re.sub(r'font:\s*inherit;', 'font: inherit;\n  font-size: var(--text-base);', content, count=1)

# Ensure media query exists at the bottom for desktop
media_query = """

/* Desktop Enhancements */
@media (min-width: 768px) {
  .login-card {
    padding: var(--space-xl);
  }
  .admin-content {
    padding: var(--space-xl);
  }
  .student-certificate {
    padding: var(--space-lg);
  }
  .admin-header {
    margin-bottom: var(--space-xl);
  }
  .seal-grid,
  .admin-stat-grid {
    gap: var(--space-md);
  }
}
"""

if "/* Desktop Enhancements */" not in content:
    content += media_query

with open(css_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored spacing and fonts successfully!")
