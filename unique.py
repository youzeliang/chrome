def deduplicate_http(file_path):
    # 读取文件内容到列表，并只保留包含 "http" 的行
    http_lines = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if 'http' in line:
                http_lines.append(line)

    # 去重
    unique_lines = list(set(http_lines))

    # 将去重后的内容覆盖回原文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(unique_lines)


file_path = "file.txt"
deduplicate_http(file_path)
