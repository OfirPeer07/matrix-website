/**
 * Groups lines into bullet points.
 * A new bullet starts if a line begins with a marker (•, -, *).
 * Otherwise, the line is appended to the current bullet as a soft break.
 */
export function groupBulletLines(text) {
    if (!text) return [];
    const lines = text.split("\n");
    const groups = [];
    let currentGroup = "";

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            // Preserve empty lines if they are within a group to allow double-line spacing
            if (currentGroup) currentGroup += "\n";
            return;
        }

        // Check if line starts with a common bullet marker
        const isNewBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");

        if (isNewBullet) {
            if (currentGroup) groups.push(currentGroup.trim());
            currentGroup = line;
        } else {
            if (!currentGroup) {
                currentGroup = line;
            } else {
                // Appending to existing group
                currentGroup += (currentGroup.endsWith("\n") ? "" : "\n") + line;
            }
        }
    });

    if (currentGroup) groups.push(currentGroup.trim());
    return groups;
}

/**
 * Strips the bullet marker from the start of a string.
 */
export function stripMarker(text) {
    return text.replace(/^[•\-*]\s*/, "");
}
