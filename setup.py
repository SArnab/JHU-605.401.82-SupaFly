from setuptools import setup, find_packages

with open('LICENSE') as f:
    license = f.read()

setup(
    name='SupaFly Clue Server',
    version='0.0.1',
    description='Starts the Clue game server',
    author='Shafique Arnab',
    author_email='shafiquearnab@gmail.com',
    url='https://github.com/SArnab/JHU-605.401.82-SupaFly',
    license=license,
    packages=find_packages(exclude=('tests', 'docs'))
)