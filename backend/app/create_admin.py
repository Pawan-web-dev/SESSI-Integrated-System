"""Create an ESSI administrator / officer account, or reset its password.

    python -m app.create_admin                       (asks for everything)
    python -m app.create_admin --username officer1 --name "Ayesha Khan" --role officer

The password is always typed in (hidden) – it is never passed on the command line.
Alternatively set ADMIN_USERNAME / ADMIN_PASSWORD in .env: the API creates that first admin when it starts.
"""
import argparse
import getpass
import sys

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password, password_problem
from app.db.session import SessionLocal
from app.models import AdminUser


def ensure_first_admin() -> str | None:
    """Create the admin from ADMIN_USERNAME / ADMIN_NAME / ADMIN_PASSWORD in .env when no admin exists yet.

    Runs at API start-up. Returns a message for the log, or None when nothing was done.
    """
    s = get_settings()
    if not s.admin_password:
        return None
    problem = password_problem(s.admin_password)
    if problem:
        return f'ADMIN_PASSWORD in .env is not used: {problem}'
    with SessionLocal() as db:
        if db.scalars(select(AdminUser.id)).first():
            return None
        db.add(AdminUser(username=s.admin_username.strip().lower(), full_name=s.admin_name, role='admin', active=True,
                         password_hash=hash_password(s.admin_password)))
        db.commit()
    return f'Created admin "{s.admin_username}" from .env. Change its password, then remove ADMIN_PASSWORD from .env.'


def main() -> None:
    parser = argparse.ArgumentParser(description='Create an ESSI administrator / officer account.')
    parser.add_argument('--username')
    parser.add_argument('--name', help='Full name')
    parser.add_argument('--role', choices=['admin', 'officer'], default='admin')
    args = parser.parse_args()

    username = (args.username or input('Username: ')).strip().lower()
    if not username:
        sys.exit('Username is required.')

    with SessionLocal() as db:
        user = db.scalars(select(AdminUser).where(AdminUser.username == username)).first()
        if user:
            print(f'User "{username}" exists – setting a new password.')
        else:
            name = (args.name or input('Full name: ')).strip()
            if not name:
                sys.exit('Full name is required.')
            user = AdminUser(username=username, full_name=name, role=args.role, active=True)
            db.add(user)

        password = getpass.getpass('Password: ')
        problem = password_problem(password)
        if problem:
            sys.exit(problem)
        if getpass.getpass('Repeat password: ') != password:
            sys.exit('Passwords do not match.')
        user.password_hash = hash_password(password)
        db.commit()
        print(f'Saved {user.role} "{username}". Sign in at #/admin in the portal.')


if __name__ == '__main__':
    main()
