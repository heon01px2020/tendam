package edu.brown.cs.student;

import edu.brown.cs.student.datasources.Source;
import edu.brown.cs.student.users.User;

import java.io.File;
import java.io.FileNotFoundException;
import java.sql.*;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class Database {

  private static Connection conn = null;
  private final String filepath;

  public Database(String filepath) throws FileNotFoundException, SQLException {
    File file = new File(filepath);
    if (!file.exists() || !file.isFile()) {
      throw new FileNotFoundException("ERROR: invalid filepath");
    }
    this.filepath = filepath;
    String urlToDB = "jdbc:sqlite:" + filepath;
    conn = DriverManager.getConnection(urlToDB);
    Statement stat = conn.createStatement();
//    stat.executeUpdate("PRAGMA foreign_keys=ON;");
    // TODO: i'm pretty sure the database isn't supposed to be closed? Otherwise your connection dies.
    stat.close();
  }

  //inserts a new user into the user table
  public void insertUser(String id, String userName, String password, String email) throws SQLException {
    //todo i think that this shouldn't be the person class because it doesn't
    // include all the fields
    //that would need to be stored in the database
    //perhaps we need to create a user class instead?
    try (PreparedStatement prepTable = conn.prepareStatement(
            "CREATE TABLE IF NOT EXISTS 'users' ("
            + "id TEXT, "
            + "username TEXT, "
            + "password TEXT, "
            + "email TEXT);")) {
      prepTable.executeUpdate();
      PreparedStatement prepUser;
      prepUser = conn.prepareStatement("INSERT INTO users VALUES (?, ?, ?, ?);");
      prepUser.setString(1, id);
      prepUser.setString(2, userName);
      prepUser.setString(3, password);
      prepUser.setString(4, email);
      prepUser.addBatch();
      prepUser.executeBatch();
    }
  }

  //inserts a new table into the database when a new survey is created
  public void insertNewSurvey(String surveyName) throws SQLException {
    try (PreparedStatement prep = conn.prepareStatement("ALTER TABLE users ADD (?) DOUBLE;")) {
      prep.setString(1, surveyName);
      prep.executeUpdate();
    }
  }


  // TODO: Change survey score parameter from double to Source

  /**
   * updates the field for a user in the table when they complete a survey
   * @param userId the unique id of the user
   * @param surveyName the name of the survey
   * @param surveyScore the score they got on the survey
   * @throws SQLException if the SQl command goes awry
   */
  public void updateSurveyData(String userId, String surveyName, Double surveyScore) throws SQLException {
    try (PreparedStatement prep = conn.prepareStatement("UPDATE users "
    + "SET ? = ?  WHERE id = ?;")) {
      prep.setString(1, surveyName);
      prep.setDouble(2, surveyScore);
      prep.setString(3, userId);
      prep.executeUpdate();
    }
  }

  //adds friend relations to a new table
  /* if A is friends with B, need to call addFriends(a.id, b.id) and
  addFriends(b.id, a.id)
   */
  public void addFriends(Integer userId, Integer friendId) throws SQLException {
    try (PreparedStatement prepTable = conn.prepareStatement("CREATE TABLE IF NOT EXISTS 'friends' "
            + " user TEXT, friend TEXT;")) {
      prepTable.executeUpdate();
    }
      try (PreparedStatement prep = conn.prepareStatement("INSERT INTO friends VALUES (?, ?);")) {
      prep.setInt(1, userId);
      prep.setInt(2, friendId);
      prep.addBatch();
      prep.executeBatch();
    }
  }

  public List<Integer> findFriends(Integer userId) throws SQLException {
    try (PreparedStatement prep = conn.prepareStatement(
            "SELECT friends.friend FROM friends WHERE friends.user = ?;")) {
      List<Integer> friends = new LinkedList<>();
      ResultSet rs = prep.executeQuery();
      while (rs.next()) {
        friends.add(rs.getInt(1));
      }
      rs.close();
      return friends;
    }
  }

  public List<User> getAllUsers() throws SQLException {
    try (PreparedStatement prep = conn.prepareStatement("SELECT * FROM users;")) {
      ResultSet rs = prep.executeQuery();
      ResultSetMetaData rd = rs.getMetaData();
      //sets all the available surveys into a hashmap
      int c = rd.getColumnCount();
      //starts at 5 because first 4 columns include other user info
      int i = 5;
      Map<String, Source> surveys = new HashMap<>();
      while (i <= c) {
        surveys.put(rd.getColumnName(i), null);
        i++;
      }

      List<User> users = new LinkedList<>();

      while (rs.next()) {
        Integer id = rs.getInt(1);
        Integer username = rs.getInt(2);
        String password = rs.getString(3);
        String email = rs.getString(4);
        int k = 5;
        while (k <= c) {
          // TODO: Fix
          surveys.put(rd.getColumnName(k), rs.getDouble(k));
          k++;
        }
        List<Integer> friends = findFriends(id);
        User user = new User(id, username, password, email, friends);
        users.add(user);
      }
      rs.close();
      return users;
    }
  }
}