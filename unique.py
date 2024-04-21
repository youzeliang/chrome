
from git import Repo
import os


def deduplicate_http(file_path):
    http_lines = []
    flag = False
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if 'http' in line:
                http_lines.append(line)
            if '<' in line:
                flag = True

    unique_lines = list(set(http_lines))

    with open(file_path, 'r', encoding='utf-8') as file:
        original_content = file.readlines()

    if original_content == unique_lines and flag:
        print("文件内容未发生变化，无需修改。")
    else:
        # 将去重后的内容覆盖回原文件
        with open(file_path, 'w', encoding='utf-8') as file:
            file.writelines(unique_lines)


file_path = "file.txt"
deduplicate_http(file_path)

dirf

repo.g







