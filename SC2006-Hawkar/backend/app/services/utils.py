def convert_str_to_list(string_value, separator=", "):
    """
    Convert a comma-separated string into a list.
    
    Args:
        string_value: String to be converted to list
        separator: Delimiter used in string (default: ", ")
        
    Returns:
        List of string items, or original value if not a string
    """
    if not string_value:
        return []
    
    # Handle string values
    if isinstance(string_value, str):
        return [item.strip() for item in string_value.split(separator)]
    
    # Return as is if already a list or other type
    return string_value


def convert_list_to_str(list_value, separator=", "):
    """
    Convert a list into a comma-separated string.
    
    Args:
        list_value: List to be converted to string
        separator: Delimiter to use in output string (default: ", ")
        
    Returns:
        String joined with the separator, or original value if not a list/tuple
    """
    if not list_value:
        return ""
    
    # Handle list and tuple values
    if isinstance(list_value, (list, tuple)):
        return separator.join(str(item) for item in list_value)
    
    # Return as is if already a string or other type
    return list_value