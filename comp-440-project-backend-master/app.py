from flask import Flask, render_template, request
from flask_cors import CORS
from db import maria
import json

app = Flask(__name__, template_folder='website')
CORS(app)
sql = maria()


@app.route('/')
@app.route('/index')
def index():
    return render_template('/index.html')


@app.route('/post', methods=['POST'])
def parse_post_request():
    if (request.method == 'POST'):
        post_type = request.args.get("type")

        if post_type == 'user':
            info = json.loads(request.get_data())
            print(info)
            result = sql.add_user(info)
            return result
        
        elif post_type == 'login':
            creds = json.loads(request.get_data())
            print(creds)
            user = sql.login(creds)
            if user == 0:
                return '0'
            return json.dumps(user)

        elif post_type == 'reset':
            sql.reset()
            return '1'

        elif post_type == 'initialize':
            sql.intialize()
            return '1'    
        
        elif post_type == 'blog':
            blog = json.loads(request.get_data())
            print(blog)
            return sql.add_blog(blog)
        
        elif post_type == 'comment':
            comment = json.loads(request.get_data())
            return sql.add_comment(comment)
        
        elif post_type == 'follow':
            pair = json.loads(request.get_data())
            return sql.add_follower(pair)

        elif post_type == 'unfollow':
            pair = json.loads(request.get_data())
            return sql.remove_follower(pair)

    return '😐 OOPS 😐'

@app.route('/get', methods=['GET'])
def parse_get_request():
    if (request.method == 'GET'):
        blog = request.args.get("blog")
        comment = request.args.get("comment")
        user = request.args.get("user")
        hobby = request.args.get("hobby")
        tags = request.args.getlist("tag")
        followers = request.args.get("followers")
        followees = request.args.getlist("followees")

        if blog == 'all':
            return json.dumps(sql.get_all_blogs())

        elif blog:
            return json.dumps(sql.get_all_positive_blogs(blog))

        elif comment:
            return json.dumps(sql.get_all_comments(comment))

        elif user == 'all':
            return json.dumps(sql.get_all_users())
        
        elif user == 'no_blogs':
            return json.dumps(sql.get_users_with_no_blogs())
        
        elif user == 'no_comments':
            return json.dumps(sql.get_users_with_no_comments())
        
        elif user == 'posted_only_negative':
            return json.dumps(sql.get_users_posted_only_neg_comments())
        
        elif user == 'no_negative':
            return json.dumps(sql.get_users_with_no_neg_comments())

        elif user:
            return json.dumps(sql.get_users_posted_blog_on_date(user))

        elif hobby:
            return json.dumps(sql.get_users_common_hobby(hobby))
        
        elif tags:
            return json.dumps(sql.get_users_with_tags(tags))
        
        elif followers:
            return json.dumps(sql.get_followers(followers))

        elif followees:
         return json.dumps(sql.get_users_followed_by(followees))
            
    return '😐 OOPS 😐'

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    sql.close()