import os
import gdown

os.makedirs('pkl_files', exist_ok=True)

files = {
    'pkl_files/hybrid.pkl': '1DwIXg8W5mKh0LDH5Cdp0MAGhoiS6QC1z',
    'pkl_files/rf.pkl': '1o9P-9QuLpHUGW_4X6B4XN8KU9MMGYbre',
    'pkl_files/svm.pkl': '1wF3xExtyOUxt41v2d2TWZfEZxSVEcQav',
    'pkl_files/xgb.pkl': '1CRQS8-TnaU-mKGh7tpsvxzvlPcAq6-l-',
}

for path, file_id in files.items():
    if not os.path.exists(path):
        print(f'Downloading {path}...')
        gdown.download(f'https://drive.google.com/uc?id={file_id}', path, quiet=False)
        print(f'{path} downloaded.')
    else:
        print(f'{path} already exists, skipping.')