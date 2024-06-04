import webbrowser



def remove_str(file_name):
    """
    打开文件，去除前71行，然后保存剩余内容。
    同时，尝试打开前71行作为URL（如果它们是有效的URL）。
    """
    with open(file_name, 'r+', encoding='utf-8') as f:
        lines = f.readlines()
        new_lines = []
        count = 0

        # 尝试打开前71行作为URL，去除每行末尾的换行符
        for line in lines[:100]:
            clean_line = line.rstrip('\n')  # 去除末尾的换行符
            webbrowser.open(clean_line)  # 打开处理后的行作为URL
            count += 1

        # 去除前71行后，保存剩余内容
        for line in lines[80:]:
            new_lines.append(line)

        # 重写文件
        f.seek(0)
        f.truncate()
        f.writelines(new_lines)

if __name__ == '__main__':
    remove_str('/Users/youzeliang/dev/code/chrome/newfile.txt')
