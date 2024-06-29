
def unique(file_name):
    http_lines = []
    with open(file_name, 'r', encoding='utf-8') as file:
        for line in file:
            http_lines.append(line)

    unique_lines = list(set(http_lines))

    with open(file_name, 'w', encoding='utf-8') as file:
        file.writelines(unique_lines)




if __name__ == '__main__':
    unique('/Users/youzeliang/dev/code/chrome/newfile.txt')
