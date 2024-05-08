from git import Repo
import os


def deduplicate_http(file_name):
    file_path = '/Users/youzeliang/dev/code/chrome'
    dirfile = os.path.abspath(file_path)
    repo = Repo(dirfile)
    g = repo.git

    g.add('--all')
    g.commit('-m', 'update file')
    g.push()

    http_lines = []
    flag = True
    with open(file_name, 'r', encoding='utf-8') as file:
        for line in file:
            if 'http' in line:
                http_lines.append(line)
            if '<' in line:
                flag = False

    unique_lines = list(set(http_lines))

    if flag:
        print("文件内容未发生变化，无需修改。")
    else:
        # 将去重后的内容覆盖回原文件
        with open(file_name, 'w', encoding='utf-8') as file:
            file.writelines(unique_lines)
    try:
        g.push()
        g.add('--all')
        g.commit('-m', 'update file')
        g.pull()
        g.push()

        http_lines = []
        flag = False
        with open(file_name, 'r', encoding='utf-8') as file:
            for line in file:
                if 'http' in line:
                    http_lines.append(line)
                if '<' in line:
                    flag = False

        unique_lines = list(set(http_lines))
        if flag:
            print("文件内容未发生变化，无需修改。")
        else:
            # 将去重后的内容覆盖回原文件
            with open(file_name, 'w', encoding='utf-8') as file:
                file.writelines(unique_lines)

            g.add('--all')
            g.commit('-m', 'update file')
            g.push()

            print("push success")

    except  Exception as e:
        pass


if __name__ == '__main__':
    deduplicate_http('/Users/youzeliang/dev/code/chrome/file.txt')
