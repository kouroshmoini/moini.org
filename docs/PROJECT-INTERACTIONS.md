# Project interaction content record

- Chinatown: replaced the standalone map figure with a shared interactive wrapper around the same approved image. Four anchors align with the existing numbered markers in the 1651 × 953 artwork. Descriptions summarize the existing intervention paragraphs; no new interventions, geography, results or authorship were added. Caption describes the concept image without assigning its authorship.
- Hochelaga: added a visual version of the existing reported 64% / 21% / 7% / 5% / 3% land-use mix. Area values duplicate the existing report table. The component explicitly says the rounded narrative shares are not calculated from the area table.
- Hochelaga: surfaced the existing 12,574 new dwellings, 31,220 projected additional residents, 3–4 residential storeys and 11–12 peripheral storeys. The 13,574 total-dwellings discrepancy is retained beside these cards and in the original narrative. All values remain labelled as proposals.
- Map interactions are image-relative markers, not geographic coordinates. The supplied raster is unchanged. Map category highlighting is limited to the explanatory controls; pixels in raster maps are not recoloured or assigned invented boundaries.
- Browser zoom/pan and gallery behavior are handled by the shared image viewer. No before/after comparison is added because the available visuals are not verified matched before/after views.

For future projects, add reviewed values and descriptions in `_data/project_interactions.json`. Use the shared includes and preserve image dimensions. Positions for Chinatown markers are defined in `assets/css/projects.css` against the approved artwork dimensions.
