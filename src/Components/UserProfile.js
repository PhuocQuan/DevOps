import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaUserCircle, FaBirthdayCake, FaVenusMars, FaMapMarkerAlt } from 'react-icons/fa';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error("Vui lòng đăng nhập để xem thông tin");
      }
      
      const { username } = JSON.parse(userData);
      console.log("Đang fetch dữ liệu cho user:", username);

      const response = await fetch("http://localhost:2300/user");
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng");
      }
      
      const users = await response.json();
      console.log("Dữ liệu nhận được từ API:", users);
      
      const currentUser = users.find(user => user.username === username);
      
      if (currentUser) {
        setUserProfile(currentUser);
        setEditedProfile(currentUser);
        console.log("Đã tìm thấy thông tin user:", currentUser);
      } else {
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi fetch data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const updateResponse = await fetch(`http://localhost:2300/user/${editedProfile.id}`, {
            method: 'PUT', // Sử dụng PUT để cập nhật user cụ thể
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedProfile), // Chỉ gửi dữ liệu của user cần cập nhật
        });

        if (!updateResponse.ok) {
            throw new Error("Không thể cập nhật thông tin");
        }

        // Cập nhật state và localStorage
        setUserProfile(editedProfile);
        localStorage.setItem('userData', JSON.stringify(editedProfile));
        setIsEditing(false);
        alert('Cập nhật thông tin thành công!');

        // Tải lại dữ liệu mới
        fetchUserProfile();
    } catch (error) {
        console.error("Error updating profile:", error);
        alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    }
};


  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!userProfile) return <div>Không có dữ liệu người dùng</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Thông Tin Cá Nhân</h2>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label><FaUser /> Họ và tên:</label>
              <input
                type="text"
                name="fullName"
                value={editedProfile.fullName}
                onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> Email:</label>
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><FaPhone /> Số điện thoại:</label>
              <input
                type="tel"
                name="phone"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><FaUserCircle /> Tên đăng nhập:</label>
              <input
                type="text"
                name="username"
                value={editedProfile.username}
                disabled
              />
            </div>

            <div className="form-group">
              <label><FaBirthdayCake /> Ngày sinh:</label>
              <input
                type="date"
                name="dob"
                value={editedProfile.dob}
                onChange={(e) => setEditedProfile({...editedProfile, dob: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><FaVenusMars /> Giới tính:</label>
              <select
                name="gender"
                value={editedProfile.gender}
                onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaMapMarkerAlt /> Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={editedProfile.address}
                onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="save-button">Lưu thay đổi</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(userProfile);
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <FaUser className="icon" />
              <span className="label">Họ và tên:</span>
              <span className="value">{userProfile.fullName}</span>
            </div>

            <div className="info-item">
              <FaEnvelope className="icon" />
              <span className="label">Email:</span>
              <span className="value">{userProfile.email}</span>
            </div>

            <div className="info-item">
              <FaPhone className="icon" />
              <span className="label">Số điện thoại:</span>
              <span className="value">{userProfile.phone}</span>
            </div>

            <div className="info-item">
              <FaUserCircle className="icon" />
              <span className="label">Tên đăng nhập:</span>
              <span className="value">{userProfile.username}</span>
            </div>

            <div className="info-item">
              <FaBirthdayCake className="icon" />
              <span className="label">Ngày sinh:</span>
              <span className="value">{userProfile.dob}</span>
            </div>

            <div className="info-item">
              <FaVenusMars className="icon" />
              <span className="label">Giới tính:</span>
              <span className="value">{userProfile.gender}</span>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <span className="label">Địa chỉ:</span>
              <span className="value">{userProfile.address}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;