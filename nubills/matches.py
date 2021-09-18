

def update_matches(matches, nubank_month_data, mobills_month_data):
    """
    Changes done in place. NuBank and Mobills expenses with match will be removed from original object.
    """
    # Filter matches to only items that still exist
    matches_cleaned = []
    for [nubank_ids, mobills_ids] in matches:
        nubank_ids_filtered = []
        for nu_id in nubank_ids:
            if nu_id in nubank_month_data:
                nubank_ids_filtered.append(nu_id)

        mobills_ids_filtered = []
        for mo_id in mobills_ids:
            if mo_id in mobills_month_data:
                mobills_ids_filtered.append(mo_id)
        
        if len(nubank_ids_filtered) > 0 and len(mobills_ids_filtered) > 0:
            matches_cleaned.append([nubank_ids_filtered, mobills_ids_filtered])
            for nu_id in nubank_ids_filtered:
                del nubank_month_data[nu_id]
            for mo_id in mobills_ids_filtered:
                del mobills_month_data[mo_id]
    
    matches = matches_cleaned
    
