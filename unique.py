from git import Repo
import os


def deduplicate_http(file_name):
    file_path = '/Users/youzeliang/dev/code/chrome'
    dirfile = os.path.abspath(file_path)
    repo = Repo(dirfile)
    g = repo.git
    g.config('--global', 'user.name', 'youze')
    g.config('--global', 'user.email', 'youzel@126.com')

    g.add('--all')
    g.commit('-m', 'update file')
    g.pull()
    # g.push()

    http_lines = []
    flag = False
    with open(file_name, 'r', encoding='utf-8') as file:
        for line in file:
            if 'http' in line:
                http_lines.append(line)
            if '<' in line:
                flag = False

    unique_lines = list(set(http_lines))
    #
    # with open(file_path, 'r', encoding='utf-8') as file:
    #     original_content = file.readlines()
    #
    # if original_content == unique_lines and flag:
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
        g.config('--global', 'user.email', 'liangyouze@tal.com')


if __name__ == '__main__':
    deduplicate_http('/Users/youzeliang/dev/code/chrome/file.txt')
