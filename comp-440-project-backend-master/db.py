import mariadb
import sys

class maria:
    def __init__(self):
        try:
            self.conn = mariadb.connect(
                user='root',
                password='root',
                host='localhost',
                port=3306,
            )
            self.cursor = self.conn.cursor()
            for line in open("reset.sql"):
                self.cursor.execute(line)
        except mariadb.Error as e:
            print(f"Error connecting to database: {e}")
            sys.exit(1)

    def add_user(self, user):
        try:
            query = "SELECT email FROM users WHERE email=%s;"
            self.cursor.execute(query, (user["email"],))
            email = self.cursor.fetchone()
            if email != None:
                return '0'
            query = "SELECT username FROM users WHERE username=%s;"
            self.cursor.execute(query, (user["username"],))
            username = self.cursor.fetchone()
            if username != None:
                return '0'
            query = "INSERT INTO users (username,password,firstName,lastName,email,hobby) VALUES (%s,%s,%s,%s,%s,%s);"
            self.cursor.execute(
                query, (user["username"], user["password"], user["firstName"], user["lastName"], user["email"], user["hobby"]))
            self.conn.commit()
            return '1'
        except mariadb.Error as e:
            print(f"Error: {e}")

    def add_blog(self, blog):
        try:
            query = "SELECT COUNT(*) FROM blogs WHERE author=%s AND creationDate=CURRENT_DATE()"
            self.cursor.execute(query, (blog["author"],))
            numOfBlogs = self.cursor.fetchone()[0]
            if numOfBlogs >= 2:
                return '0'
            query = "INSERT INTO blogs (author,subject,description) VALUES (%s,%s,%s);"
            self.cursor.execute(query, (blog["author"], blog["subject"], blog["description"]))
            self.conn.commit()
            for tag in blog["tags"]:
                query = "INSERT INTO tags (tag, blogid) SELECT %s, MAX(blogid) FROM blogs;"
                self.cursor.execute(query, (tag,))
                self.conn.commit()
            return '1'
        except mariadb.Error as e:
            print(f"Error: {e}")

    def add_follower(self, pair):
        try:
            query = "INSERT INTO follows (follower,followee) VALUES (%s,%s);"
            self.cursor.execute(query, (pair["follower"], pair["followee"]))
            self.conn.commit()
            return '1'
        except mariadb.Error as e:
            print(f"Error: {e}")

    def add_comment(self, comment):
        try:
            query = "SELECT COUNT(*) FROM blogs WHERE author=%s AND blogid=%s"
            self.cursor.execute(query, (comment["author"], comment["blogid"]))
            isOwnBlog = self.cursor.fetchone()[0]
            if isOwnBlog == 1:
                return '3'

            query = "SELECT COUNT(*) FROM comments WHERE author=%s AND blogid=%s"
            self.cursor.execute(query, (comment["author"], comment["blogid"]))
            numOfCommentsOnBlog = self.cursor.fetchone()[0]
            if numOfCommentsOnBlog > 1:
                return '2'
                
            query = "SELECT COUNT(*) FROM comments WHERE author=%s AND creationDate=CURRENT_DATE()"
            self.cursor.execute(query, (comment["author"],))
            numOfTotalComments = self.cursor.fetchone()[0]
            if numOfTotalComments > 3:
                return '0'
            
            query = "INSERT INTO comments (author,blogid,sentiment,description) VALUES (%s,%s,%s,%s);"
            self.cursor.execute(query, (comment["author"], comment["blogid"], comment["sentiment"], comment["description"]))
            self.conn.commit()
            return '1'
        except mariadb.Error as e:
            print(f"Error: {e}")

    def remove_follower(self, pair):
        try:
            query = "DELETE FROM follows WHERE follower = %s AND followee = %s;"
            self.cursor.execute(query, (pair["follower"], pair["followee"]))
            self.conn.commit()
            return '1'
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_all_positive_blogs(self, username):
        try:
            query = "SELECT * FROM blogs WHERE author = %s AND blogid NOT IN (SELECT blogid FROM comments WHERE sentiment='negative');"
            self.cursor.execute(query, (username,))
            blogs = self.cursor.fetchall()
            jsonBlogs = []
            for blogid, author, subject, description, creationDate in blogs:
                query = "SELECT tag FROM tags WHERE blogid = %s;"
                self.cursor.execute(query, (blogid,))
                tags = list(self.cursor.fetchall())
                jsonBlogs.append(
                    {"blogid": blogid, "author": author, "subject": subject, "description": description, "tags": tags, "creationDate": creationDate.strftime('%Y-%m-%d')})
            return jsonBlogs
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_all_blogs(self):
        try:
            query = "SELECT * FROM blogs;"
            self.cursor.execute(query)
            blogs = self.cursor.fetchall()
            jsonBlogs = []
            for blogid, author, subject, description, creationDate in blogs:
                query = "SELECT tag FROM tags WHERE blogid = %s;"
                self.cursor.execute(query, (blogid,))
                tags = list(self.cursor.fetchall())
                jsonBlogs.append(
                    {"blogid": blogid, "author": author, "subject": subject, "description": description, "tags": tags, "creationDate": creationDate.strftime('%Y-%m-%d')})
            return jsonBlogs
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_all_comments(self, blogid):
        try:
            query = "SELECT * FROM comments WHERE blogid=%s;"
            self.cursor.execute(query, (blogid,))
            comments = self.cursor.fetchall()
            jsonComments = []
            for commentid, author, blogid, sentiment, description, creationDate in comments:
                jsonComments.append(
                    {"commentid": commentid, "author": author, "blogid": blogid, "sentiment": sentiment, "description": description, "creationDate": creationDate.strftime('%Y-%m-%d')})
            return jsonComments
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_all_users(self):
        try:
            query = "SELECT * FROM users;"
            self.cursor.execute(query)
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_with_no_blogs(self):
        try:
            query = "SELECT * FROM users WHERE username NOT IN (SELECT author FROM blogs);"
            self.cursor.execute(query)
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_with_no_comments(self):
        try:
            query = "SELECT * FROM users WHERE username NOT IN (SELECT author FROM comments);"
            self.cursor.execute(query)
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_posted_only_neg_comments(self):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT author FROM comments WHERE sentiment='negative') AND username NOT IN (SELECT author FROM comments WHERE sentiment='positive');"
            self.cursor.execute(query)
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_with_no_neg_comments(self):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT author FROM blogs WHERE blogid NOT IN (SELECT blogid FROM comments WHERE sentiment='negative'));"
            self.cursor.execute(query)
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_posted_blog_on_date(self, date):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT author FROM (SELECT author, COUNT(blogid) AS numOfBlogs FROM blogs WHERE creationDate=%s GROUP BY author) AS n WHERE numOfBlogs = (SELECT MAX(numOfBlogs) FROM (SELECT author, COUNT(blogid) AS numOfBlogs FROM blogs WHERE creationDate=%s GROUP BY author) AS m));"
            self.cursor.execute(query, (date, date))
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_common_hobby(self, hobby):
        try:
            query = "SELECT * FROM users WHERE hobby = %s;"
            self.cursor.execute(query, (hobby,))
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_with_tags(self, tags):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT b.author FROM blogs b INNER JOIN tags t ON b.blogid = t.blogid WHERE t.tag = %s OR t.tag = %s HAVING COUNT(DISTINCT(b.blogid)) > 1);"
            self.cursor.execute(query, (tags[0], tags[1], tags[0], tags[1]))
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_followers(self, username):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT follower FROM follows WHERE followee = %s);"
            self.cursor.execute(query, (username,))
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def get_users_followed_by(self, pair):
        try:
            query = "SELECT * FROM users WHERE username IN (SELECT followee FROM follows WHERE follower = %s) AND username IN (SELECT followee FROM follows WHERE follower = %s);"
            self.cursor.execute(query, (pair[0], pair[1]))
            users = self.cursor.fetchall()
            jsonUsers = []
            for username, password, firstName, lastName, email, hobby in users:
                jsonUsers.append(
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "email": email, "hobby": hobby})
            return jsonUsers
        except mariadb.Error as e:
            print(f"Error: {e}")

    def login(self, creds):
        try:
            query = "SELECT firstName, lastName, email FROM users WHERE username=%s AND password=%s;"
            self.cursor.execute(query, (creds["username"], creds["password"]))
            user = self.cursor.fetchone()
            if user == None:
                return 0
            return {"username": creds["username"], "firstName": user[0], "lastName": user[1], "email": user[2]}
        except mariadb.Error as e:
            print(f"Error: {e}")
    
    def reset(self):
        try:
            for line in open("reset.sql"):
                self.cursor.execute(line)
        except mariadb.Error as e:
            print(f"Error: {e}")

    def intialize(self):
        try:
            for line in open("initialize.sql"):
                self.cursor.execute(line)
        except mariadb.Error as e:
            print(f"Error: {e}")        

    def close(self):
        self.conn.close()